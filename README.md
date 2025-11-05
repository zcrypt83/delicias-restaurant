## Delicias Restaurant — Aplicación Frontend (React)

Este repositorio contiene la interfaz web de "Delicias Restaurant", una aplicación construida con Create React App y React (React Router, React Bootstrap y utilidades propias).

El objetivo de este README es explicar cómo ejecutar, desarrollar y desplegar la app (incluyendo el despliegue en GitHub Pages), además de anotar problemas conocidos y soluciones rápidas.

## Requisitos

- Node.js (recomendado 16+). Comprueba con `node -v` y `npm -v`.
- Git (para trabajar con el repositorio y desplegar con `gh-pages`).

## Estructura principal

- `public/` — archivos estáticos (index.html, manifest, robots.txt).
- `src/` — código fuente React:
	- `components/` — componentes UI reutilizables (incluye `layout/` con `Navigation.jsx`, `Footer.jsx`).
	- `pages/` — vistas/páginas (Home, MenuDigital, Cart, etc.).
	- `context/` — React Contexts (Auth, Restaurant).
	- `hooks/` — hooks personalizados.
	- `img/` — imágenes empaquetadas por webpack (por ejemplo `logo.png`).
	- `utils/`, `styles/`, `admin/`, `staff/` — módulos auxiliares según funcionalidades.

## Comandos comunes

En el directorio del proyecto:

```powershell
npm install        # Instala dependencias
npm start          # Ejecuta la app en modo desarrollo (http://localhost:3000)
npm test           # Ejecuta tests (modo watch)
npm run build      # Compila para producción en la carpeta `build`
```

Para desplegar en GitHub Pages (ya configurado en este repositorio):

```powershell
# (si aún no está instalado) npm install --save-dev gh-pages
npm run deploy     # Ejecuta build y publica en la rama gh-pages
```

> Nota: `npm run deploy` usa los scripts `predeploy`/`deploy` definidos en `package.json`.

## Despliegue en GitHub Pages (pasos clave)

1. En `package.json` debe existir la propiedad `homepage` apuntando a la URL del sitio: `https://<usuario>.github.io/<repo>/`.
2. Instalar `gh-pages` como dependencia de desarrollo: `npm install --save-dev gh-pages`.
3. Añadir scripts:

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

4. Debido a que GitHub Pages sirve archivos estáticos desde un subdirectorio, en esta app usamos `HashRouter` (react-router-dom) para evitar problemas con rutas y refreshs en producción.

5. Ejecutar `npm run deploy` subirá el contenido de `build/` a la rama `gh-pages` (o publicará con gh-pages) y tu sitio quedará disponible en la URL indicada en `homepage`.

## Notas específicas del proyecto (problemas comunes y soluciones aplicadas)

- Pantalla blanca tras publicar: frecuentemente causada por el uso de `BrowserRouter` en GitHub Pages. Solución: cambiar a `HashRouter` (ya aplicado en `src/App.js`).
- Logo en la UI no cargaba: el proyecto originalmente usaba rutas absolutas (`/logo.png`). Se cambió a importar la imagen desde `src/img/logo.png` y usar `src={logo}` en `Navigation.jsx` y `Footer.jsx`. Esto garantiza que el bundler (webpack) incluya el asset correctamente.
- Alternativa de assets: si prefieres referenciar imágenes desde HTML estático o `public/`, coloca la imagen en `public/` y usa `process.env.PUBLIC_URL + '/logo.png'` o una ruta absoluta; en ese caso la imagen no será transformada por webpack.

## Limpieza de warnings / ESLint

Durante la compilación aparecen advertencias de ESLint sobre imports/variables no usadas en varios archivos (por ejemplo `Alert` importado pero no usado). Son advertencias, no errores, pero es recomendable limpiarlas:

- Elimina imports no usados.
- Si un warning es intencional, puedes añadir `// eslint-disable-next-line` sobre la línea específica.

Limpiar estos warnings mejora la calidad del código y evita ruido en CI/builds.

## Cómo contribuir / flujo de trabajo local

1. Crea una rama para tu feature: `git checkout -b feature/nombre`.
2. Haz cambios, añade tests si corresponde.
3. `git add .` `git commit -m "Describe tu cambio"`.
4. `git push origin feature/nombre` y abre un Pull Request.

Antes de mergear, asegúrate de que `npm run build` compila sin errores.

## Verificación y troubleshooting de despliegue

- Si la página muestra contenido incompleto o pantalla blanca:
	- Abre la consola del navegador (F12) y verifica errores (404 para assets o errores JS).
	- Asegúrate que `homepage` en `package.json` coincide con la URL pública.
	- Si usas rutas, confirma que el Router es `HashRouter` o que el servidor soporta rewrites para `BrowserRouter`.
	- Fuerza recarga (Ctrl+F5) o prueba en modo incógnito (caché viejo puede mostrar versiones anteriores).

## Información adicional y contacto

- Repositorio: https://github.com/zcrypt83/delicias-restaurant
- Página publicada: https://zcrypt83.github.io/delicias-restaurant/

