-- SQLite schema para Delicias Restaurant
-- Las tablas se crean automáticamente si no existen

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  role TEXT CHECK(role IN ('customer', 'admin', 'cajero', 'cocinero', 'mesero')) DEFAULT 'customer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  category TEXT NOT NULL DEFAULT 'uncategorized',
  image TEXT,
  is_available BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  table_number INTEGER,
  total DECIMAL(10,2) NOT NULL,
  status TEXT CHECK(status IN ('pending', 'preparing', 'completed', 'cancelled', 'delivered')) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de items de órdenes
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Tabla de reservaciones
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  reservation_date DATETIME NOT NULL,
  number_of_guests INTEGER NOT NULL,
  status TEXT CHECK(status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);