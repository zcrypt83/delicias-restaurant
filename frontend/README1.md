# Frontend (React) — mover la app existente a `frontend/`

Este proyecto original estaba en la raíz. Para organizar el repositorio hemos decidido separar `frontend/` y `backend/`.

Pasos para mover la app actual al subdirectorio `frontend/`:

1. Mueve los archivos y carpetas relacionados con la app React a `frontend/`:
   - `package.json`, `public/`, `src/`, `README.md`, `build/` (si existe)
   - NOTA: No muevas `node_modules/` — ejecuta `npm install` dentro de `frontend/` después.

2. Desde `frontend/`, instala dependencias y ejecuta la app:

```powershell
cd frontend
npm install
npm start
```

3. Conexión al backend
- En desarrollo puedes usar `HashRouter` en el frontend y apuntar llamadas API a `http://localhost:5000/api`.
