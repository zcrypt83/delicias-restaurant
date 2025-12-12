# Delicias Restaurant — Sistema completo

Este repositorio contiene la implementación completa de la aplicación Delicias Restaurant: backend en Node.js/Express con SQLite y frontend en React. Incluye gestión de usuarios, productos, pedidos, reservas y control de asistencia del personal.

## Contenido y estructura
- **backend/**: API, DB, migraciones, scripts y lógica del servidor.
- **frontend/**: Aplicación React (UI, componentes, páginas y estilos).
- **.gitignore**: Exclusiones para desarrollo.
- **scripts/ y archivos markdown**: Documentación y utilidades de proyecto.

Estructura principal (resumen):

- backend/
  - data/db/delicias.db — archivo SQLite (no versionado if .gitignore active)
  - db/schema.sql — esquema de base de datos
  - src/ — código del servidor: routes, config, middleware
  - scripts/ — migraciones y scripts de prueba (e.g., migrate_reservations_assign_userid.js)
  - init-db.js — script para inicializar DB
- frontend/
  - src/ — aplicación React
  - public/ — recursos estáticos
  - package.json — dependencias front-end

## Tecnologías y stack
- Backend: Node.js, Express, sqlite3, JWT, bcrypt, socket.io
- Frontend: React, React Router, axios, React Bootstrap
- Tests/Utilidades: Node scripts bajo `backend/scripts` para test e init

## Requisitos previos
- Node.js (v14+ recomendado) y npm o yarn
- PowerShell en Windows o bash en macOS/Linux
- (Opcional) SQLite CLI para inspección

## Configuración rápida

1. Clonar el repositorio

```pwsh
git clone https://github.com/zcrypt83/delicias-restaurant.git
cd delicias-restaurant/proyect
```

2. Backend — instalar dependencias y crear DB

```pwsh
cd backend
npm install
# Inicializa la DB con schema, datos iniciales y seed real
node init-db.js
```

3. Frontend — instalar y arrancar

```pwsh
cd ../frontend
npm install
npm start
# abre http://localhost:3000 por defecto
```

4. Iniciar backend

```pwsh
cd ../backend
npm run dev # o npm start según package.json
# escucha por defecto en http://localhost:5000
```

## Base de datos (SQLite)

- Archivo de DB: `backend/data/delicias.db`.
- Esquema principal: [backend/db/schema.sql](backend/db/schema.sql)
  - La tabla `attendances` incluye la restricción CHECK con estados en español:

```
CREATE TABLE IF NOT EXISTS attendances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  time_in DATETIME,
  time_out DATETIME,
  status TEXT CHECK(status IN ('presente', 'ausente', 'tarde', 'salio_temprano')) DEFAULT 'presente',
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, date)
);
```

- Recomendación: hacer backup antes de migraciones:

```pwsh
cd backend/data
copy .\delicias.db delicias.db.backup_$(Get-Date -Format yyyyMMddHHmmss)
```

## Migraciones y scripts importantes
- `backend/scripts/migrate_attendances_to_spanish.js` — mapea valores antiguos en inglés a español.
- `backend/scripts/upgrade_attendances_schema_spanish.js` — reconstruye tabla con CHECK en español, copia datos y renombra tablas.
- `backend/scripts/migrate_reservations_assign_userid.js` — asigna `user_id` a reservas existentes encontrando email coincidente en `users`.
- `init-db.js` — crea esquema básico y opciones seed.
- Scripts de prueba: `backend/scripts/test_mark_attendance.js`, `backend/scripts/test_reservations.js`.

Ejecutar migrations (ejemplo):

```pwsh
cd backend
node scripts/upgrade_attendances_schema_spanish.js
node scripts/migrate_reservations_assign_userid.js
```

## Endpoints principales (resumen)
- `POST /api/auth/login` — login (devuelve JWT)
- `POST /api/auth/register` — crear usuario
- `GET /api/products` — listar productos
- `POST /api/reservations` — crear reserva (intenta asociar `user_id` por token o email)
- `GET /api/reservations/my-reservations` — reservas asociadas al usuario autenticado
- `POST /api/attendances/mark` — marca asistencia del personal; devuelve JSON `{ message, timestamp, attendance }`
- `GET /api/attendances` — listado (roles admin/cajero etc.)
- `PUT /api/attendances/:id` — actualizar asistencia (admin)
- `DELETE /api/attendances/:id` — eliminar asistencia (admin)

Referencias a código: `backend/src/routes/attendances.js`, `backend/src/routes/reservations.js`.

## Frontend Ui — funcionalidad relevante
- Componente para marcar asistencia: `frontend/src/components/common/StaffAttendanceButton.jsx`.
- Administrador: `frontend/src/admin/AttendanceManager.jsx`.
- Reservas: `frontend/src/pages/Reservations.jsx` consume `getMyReservations()` del API.
- Axios API util: `frontend/src/utils/api.js` — clientes y funciones: `markAttendance()`, `getAttendances()`, `createReservation()`, `getMyReservations()`.

## Manejo de errores detectados y buenas prácticas
- Si ves `no such table: attendances` -> ejecutar `node init-db.js` en `backend`.
- Si la API devuelve `CHECK constraint failed` por estados en inglés: ejecutar las migraciones `upgrade_attendances_schema_spanish.js`.
- Si `Failed to fetch` en el frontend -> verificar que el backend está corriendo en `localhost:5000` y que no hay procesos Node colgando en ese puerto. En Windows:

```pwsh
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
# o inspeccionar puertos:
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
```

- MetaMask & extensiones: se agregaron manejadores globales de errores en `frontend/src/context/RestaurantContext.jsx` y `frontend/src/App.js` para evitar fallas por errores no capturados de inyecciones de extensiones.

## Testing y scripts de validación
- `node backend/scripts/test_mark_attendance.js` — registra login y marca la asistencia de un usuario de prueba.
- `node backend/scripts/test_reservations.js` — crea reservas y valida asociación con `user_id`.

## Push y Git
- Antes de pushear: verificar `.gitignore` para asegurar que `backend/data/delicias.db`, `node_modules/` y `build/` no se suban.
- Pasos para push:

```pwsh
git status
git add .
git commit -m "Agregar / actualizar cambios: README, migraciones, features"
git pull --rebase origin main
git push origin main
```

Si tu carpeta `proyect` se está controlando como enlace Git (submodule/gitlink), revisa que quieres mantenerlo como submodule o integrarlo al repo.

## Contribución y contacto
- Reporta issues en GitHub o usa PRs para cambios; escribe pruebas y actualiza migraciones cuando cambies constraints de DB.
- Contacto: zcrypt83 (propietario del repositorio).

## Licencia
- MIT
