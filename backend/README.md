# Delicias - Backend (Node + Express + MySQL)

Este backend está diseñado para conectarse a una base de datos MySQL (por ejemplo la que provee XAMPP). Está pensado para ejecutarse localmente y consumir datos desde la app frontend.

Requisitos
- Node.js 16+ (recomendado)
- XAMPP (MySQL) o cualquier servidor MySQL en `localhost`

Pasos rápidos
1. Asegúrate de que MySQL (XAMPP) esté corriendo y crea la base de datos y tablas ejecutando el SQL en `db/schema.sql`. Puedes usar phpMyAdmin (XAMPP) o la línea de comandos MySQL.
   - phpMyAdmin: importa `backend/db/schema.sql` o copia y ejecuta su contenido.
2. Copia `.env.example` a `.env` y ajusta las credenciales de conexión si es necesario:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=delicias_db
PORT=5000
```

3. Instala dependencias:

```powershell
cd backend
npm install
```

4. Inicia el servidor:

```powershell
npm run dev   # para desarrollo con nodemon
# o
npm start
```

Puntos importantes
- Este backend usa `mysql2` con pool de conexiones. No necesita que XAMPP levante un servidor HTTP; únicamente que MySQL esté activo (desde el panel de XAMPP).
- Las rutas principales están en `src/routes` (por ejemplo `/api/products`).

Integración con frontend
- Configura el frontend para apuntar a `http://localhost:5000/api/...` para consumir la API.
