# Delicias Restaurant - System Documentation

This document outlines the key process flows and architecture of the Delicias Restaurant digital platform.

## 1. Authentication Flow

The authentication system uses JSON Web Tokens (JWT) for secure, stateless authentication.

### 1.1. User Registration

A new user provides their name, email, and password to register. The backend hashes the password using `bcrypt` before storing it, ensuring that plaintext passwords are never saved.

```mermaid
sequenceDiagram
    participant Client as Frontend (React)
    participant Server as Backend (Node.js)
    participant DB as Database (MySQL)

    Client->>Server: POST /api/auth/register (name, email, password)
    Server->>Server: Validate input data
    Server->>DB: CHECK if email exists
    alt Email already exists
        Server-->>Client: 400 Bad Request (User exists)
    else Email does not exist
        Server->>Server: Hash password with bcrypt
        Server->>DB: INSERT new user with hashed password
        DB-->>Server: Return new user ID
        Server->>Server: Generate JWT (signed with JWT_SECRET)
        Server-->>Client: 201 Created (token, user object)
        Client->>Client: Store token and user in localStorage
        Client->>Client: Redirect to profile/dashboard
    end
```

### 1.2. User Login

A registered user logs in with their email and password. The backend compares the provided password with the stored hash.

```mermaid
sequenceDiagram
    participant Client as Frontend (React)
    participant Server as Backend (Node.js)
    participant DB as Database (MySQL)

    Client->>Server: POST /api/auth/login (email, password)
    Server->>DB: SELECT user by email
    alt User not found
        Server-->>Client: 400 Bad Request (Invalid credentials)
    else User found
        Server->>Server: Compare provided password with stored hash using bcrypt.compare()
        alt Password does not match
            Server-->>Client: 400 Bad Request (Invalid credentials)
        else Password matches
            Server->>Server: Generate JWT (signed with JWT_SECRET)
            Server-->>Client: 200 OK (token, user object)
            Client->>Client: Store token and user in localStorage
            Client->>Client: Redirect to dashboard or intended page
        end
    end
```

### 1.3. Authenticated API Requests

Once logged in, the JWT is sent in the `Authorization` header for all protected API requests. A `axios` interceptor on the frontend automates this process. The backend uses middleware to verify the token.

```mermaid
sequenceDiagram
    participant Client as Frontend (React)
    participant Server as Backend (Node.js)

    Client->>Server: GET /api/orders/my-orders (Header: "Authorization: Bearer <token>")
    Server->>Server: `auth` middleware intercepts request
    Server->>Server: Verify JWT signature and expiration
    alt Token is invalid or expired
        Server-->>Client: 401 Unauthorized or 400 Bad Request
    else Token is valid
        Server->>Server: Extract user payload (id, role) from token
        Server->>Server: Attach user object to the request
        Server->>Server: Pass control to the route handler
        Server-->>Client: 200 OK (requested data)
    end
```

## 2. Order Placement Flow

This flow describes how a logged-in user places an order. The backend uses a database transaction to ensure that the order and its associated items are created atomically.

```mermaid
sequenceDiagram
    participant Client as Frontend (React)
    participant Server as Backend (Node.js)
    participant DB as Database (MySQL)

    Client->>Client: User adds items to the cart
    Client->>Server: POST /api/orders (items, total, table_number?)
    Note over Server: `auth` middleware verifies user token
    
    Server->>DB: START TRANSACTION
    Server->>DB: INSERT into `orders` table (user_id, total, status='pending')
    DB-->>Server: Return new order_id
    
    Server->>Server: Prepare order items array
    Server->>DB: INSERT into `order_items` table (order_id, product_id, quantity, price)
    
    alt Any error occurs
        Server->>DB: ROLLBACK TRANSACTION
        Server-->>Client: 500 Server Error
    else All queries succeed
        Server->>DB: COMMIT TRANSACTION
        Server-->>Client: 201 Created (orderId, message)
    end
```

## 3. Reservation Flow

A user (either a guest or logged-in) can make a reservation. If logged in, their details are pre-filled.

```mermaid
sequenceDiagram
    participant Client as Frontend (React)
    participant Server as Backend (Node.js)
    participant DB as Database (MySQL)

    Client->>Client: User fills out reservation form (date, time, guests, name, etc.)
    Client->>Server: POST /api/reservations (reservationData)
    
    Server->>Server: Validate input data
    Server->>DB: INSERT into `reservations` table
    alt Error during insertion
        Server-->>Client: 500 Server Error
    else Insertion successful
        DB-->>Server: Return new reservation_id
        Server-->>Client: 201 Created (id, message)
    end

    opt Logged-in User
        Client->>Server: GET /api/reservations/my-reservations
        Note over Server: `auth` middleware verifies user token
        Server->>DB: SELECT reservations where user_id matches
        DB-->>Server: Return list of reservations
        Server-->>Client: 200 OK (reservations list)
        Client->>Client: Display user's reservations on the page
    end
```

