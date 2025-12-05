## Delicias Restaurant — Aplicación Frontend (React)

BiBienvenido al repositorio frontend de Delicias Restaurant. Esta aplicación está construida con Create React App y organizada para soportar usuarios, personal (staff) y paneles administrativos.

Este README documenta: cómo ejecutar el proyecto en desarrollo, cómo construir para producción, estructura del código, piezas clave (components, context, hooks), pruebas y recomendaciones de despliegue (incluyendo GitHub Pages).

## Contrato mínimo (qué hace la app)
- Entrada: interacción del usuario vía UI (navegación, formularios, selección de productos, pedidos).
- Salida: renderizado SPA (HTML/CSS/JS), llamadas a APIs externas (backend no incluido en este repositorio). Cuando se realiza un pedido, el frontend formatea y envía datos al backend vía fetch/axios (según integraciones del proyecto).
- Errores esperados: falta de conexión al backend, errores de validación de formulario, assets faltantes.

## Tecnologías y dependencias principales
- React (Create React App) — base de la SPA.
- react-router-dom — enrutamiento de la aplicación (se recomienda `HashRouter` para GitHub Pages).
- React Bootstrap (u otra librería UI similar) — componentes visuales reutilizables y responsive.
- Librerías auxiliares posibles: axios o fetch para peticiones HTTP, date-fns o moment para fechas, librerías de gestión del estado local cuando aplica.
- gh-pages — (opcional, devDependency) para publicar la carpeta `build/` en GitHub Pages.

Nota: las dependencias exactas se listan en `package.json`. Si quieres que agregue una tabla con versiones exactas la incluyo.

## Cómo ayuda el sistema — valor y beneficios
Este frontend está diseñado para facilitar la operación de un restaurante en línea y ofrece valor en varias áreas:

- Experiencia de cliente mejorada: interfaz clara para explorar el menú, seleccionar productos y completar pedidos desde cualquier dispositivo (responsive).
- Reducción de errores operativos: el sistema centraliza la información de pedidos y permite al staff (cocina, cajero, mesero) ver y actualizar el estado de órdenes en tiempo real (según integraciones con el backend).
- Ahorro de tiempo y mayor eficiencia: flujos predefinidos para procesar pedidos, gestionar reservas y ordenar entrega o self-ordering agilizan la operación diaria.
- Flexibilidad para roles: paneles diferenciados para staff y admin permiten separar responsabilidades (ej. cajero procesa pagos, cocina visualiza tickets, admin gestiona menú/precios).
- Fácil despliegue y mantenimiento: aplicación creada con CRA, empaquetada en `build/` para desplegar en múltiples proveedores de hosting estático.

## Casos de uso típicos
- Cliente: navega el menú digital, agrega productos al carrito, aplica cupones (si aplica), realiza pago o reserva.
- Mesero: recibe pedidos desde mesas (o los asigna), marca platos como preparados, comunica el estado al cliente.
- Cocinero: visualiza tickets en cola, marca preparación listada por prioridad.
- Cajero: procesa pagos, emite comprobantes y cierra la orden.
- Administrador: edita el menú, precios y supervisa métricas como ventas y órdenes abiertas.

## Flujo de usuario (ejemplo simplificado)
1. Cliente abre la web -> `Home` / `MenuDigital`.
2. Selecciona productos -> se añaden a `Cart` (estado gestionado por `UseCart` y `CartUtils`).
3. Cliente procede a checkout -> se valida información (dirección, mesa, método de pago).
4. Frontend construye el payload y lo envía al backend (fetch/axios). Si la API responde OK, se muestra confirmación y el pedido se registra en el sistema.
5. El staff (según roles) recibe notificaciones o consulta el panel para procesar la orden.

## Integración con backend y APIs
- Este repositorio contiene solo el frontend. Para completar la solución se recomienda una API REST o GraphQL que exponga endpoints para:
  - Autenticación y autorización (tokens JWT).
  - Gestión de productos/menú.
  - Creación y consulta de pedidos.
  - Gestión de usuarios y roles.

- Contrato básico: el frontend envía JSON y recibe respuestas JSON estandarizadas con códigos HTTP (200, 201, 400, 401, 500). Maneja errores mostrando mensajes claros al usuario.

## Seguridad y buenas prácticas
- No almacenar tokens sensibles sin cifrado en localStorage si es posible; usar cookies seguras (HttpOnly) cuando el backend lo permita.
- Validar entradas en frontend y repetir validación en backend.
- Manejar expiración de sesión y refresh de tokens.

---

## Requisitos
- Node.js 16+ recomendado (ver `node -v`).
- npm 8+ o yarn (según tu preferencia).
- Git para controlar versiones y para despliegues con `gh-pages` si aplica.

## Comandos útiles (PowerShell)
En la raíz del proyecto ejecuta:

```powershell
npm install        # Instala dependencias
npm start          # Ejecuta la app en modo desarrollo -> http://localhost:3000
npm test           # Ejecuta tests (configurados con react-scripts)
npm run build      # Compila para producción en la carpeta `build`
```

Si el repositorio usa `gh-pages` para publicar en GitHub Pages:

```powershell
# Instalar si no está
npm install --save-dev gh-pages
npm run deploy     # predeploy/build y deploy a gh-pages (según package.json)
```

Observación: los scripts concretos están definidos en `package.json`. Revisa la propiedad `homepage` si vas a publicar en GitHub Pages.

## Estructura del proyecto (resumen)
Raíz:
- `public/` — archivos estáticos (index.html, manifest.json, robots.txt).
- `src/` — código fuente principal.

Dentro de `src/`:
- `admin/` — vistas relacionadas al panel administrativo (`AdminPanel.jsx`).
- `components/`
  - `auth/` — `Login.jsx`, `ProtectedRoute.jsx` (control de acceso y rutas protegidas).
  - `common/` — componentes reutilizables: `AccessDenied.jsx`, `BadgeRole.jsx`, `LoadingButton.jsx`, `MetricCard.jsx`, `PriceFormatter.jsx`, `StatusBadge.jsx`.
  - `layout/` — `Navigation.jsx`, `Footer.jsx`, `Layout.jsx` (estructura de la app).
  - `ui/` — `Notification.jsx` (sistema de notificaciones UI).
- `context/` — React Contexts: `AuthContext.jsx`, `RestaurantContext.jsx` (gestión de estado global como usuario y estado del restaurante).
- `hooks/` — hooks personalizados: `UseCart.jsx`, `UseOrders.jsx`, `UsePermissions.jsx`, `UseResponsive.jsx`.
- `pages/` — páginas principales: `Home.jsx`, `MenuDigital.jsx`, `Cart.jsx`, `Orders.jsx`, `Profile.jsx`, `Reservations.jsx`, `SelfOrdering.jsx`, `Delivery.jsx`.
- `staff/` — paneles para roles (Cajero, Cocinero, Mesero) y `StaffDashboard.jsx`.
- `styles/` — CSS global y por páginas (`animations.css`, `Footer.css`, `Layout.css`, `navigations.css`, `pages/Home.css`).
- `utils/` — utilidades: `CartUtils.jsx`, `Formatters.jsx`, `NavigationRoutes.jsx`, `OrderUtils.jsx`.

## Descripción rápida de piezas clave
- AuthContext: expone estado del usuario, roles y helpers para login/logout.
- RestaurantContext: comparte estado de restaurante (configuración, menú en memoria si aplica).
- UseCart / CartUtils: lógica de carrito (añadir, eliminar, calcular totales, persistencia local si corresponde).
- ProtectedRoute: protege rutas según autenticación y roles.

## Desarrollo y pruebas
- Añade tests pequeños (Jest/React Testing Library). El proyecto ya incluye `App.test.js` y `setupTests.js`.
- Ejecuta `npm test` para lanzarlos. Para un test rápido:

```powershell
npm test -- --watchAll=false --coverage
```

## Linter y calidad
- Si usas ESLint, corrige imports no usados y warnings. Esto reduce ruido en CI.
- Recomendación: ejecutar `npm run lint` si existe el script; si no, considerar agregar ESLint con la configuración del equipo.

## Despliegue (puntos prácticos)
- GitHub Pages: si usas `gh-pages`, añade `homepage` en `package.json` con la URL pública y usa `HashRouter` en lugar de `BrowserRouter` para evitar problemas de refresh.
- Servidores estáticos: subir la carpeta `build/` a cualquier hosting estático (Netlify, Vercel, S3 + CloudFront). Asegúrate de configurar rewrites si usas `BrowserRouter`.

## Edge cases y consideraciones
- Assets no cargan en producción: revisar rutas relativas y `process.env.PUBLIC_URL`.
- Fallos de autenticación: manejar tokens expirados y mostrar mensajes claros al usuario.
- Carrito vacío: UI debe manejar gracefully (mensaje y CTA para volver al menú).

## Troubleshooting rápido
- Pantalla en blanco: abrir consola DevTools -> ver errores JS o 404 para assets.
- Rutas 404 en GitHub Pages: usar `HashRouter` o configurar 404.html que redirija a `index.html`.

## Soluciones operativas para el restaurante

El sistema proporciona 5 soluciones clave para optimizar la gestión del restaurante:

1. Gestión de pedidos en tiempo real
   - Panel de control unificado para visualizar todos los pedidos activos
   - Sistema de priorización automática según tiempo de espera
   - Notificaciones instantáneas entre cocina, meseros y caja
   - Seguimiento del estado de cada pedido (recibido → en preparación → listo → entregado)
   - Estadísticas de tiempos de preparación y entrega

2. Control de inventario y menú digital
   - Actualización instantánea del menú (precios, disponibilidad, nuevos platos)
   - Alertas automáticas de productos agotados
   - Gestión de promociones y ofertas especiales
   - Categorización flexible del menú
   - Registro histórico de cambios de precios y disponibilidad

3. Gestión de reservas y mesas
   - Vista calendario de reservaciones
   - Asignación inteligente de mesas según capacidad
   - Sistema de espera virtual con notificaciones
   - Control de ocupación en tiempo real
   - Histórico de reservas por cliente

4. Análisis de ventas y reportes
   - Dashboard con métricas clave:
     * Ventas diarias/semanales/mensuales
     * Platos más vendidos
     * Horas pico de pedidos
     * Tiempo promedio de atención
     * Satisfacción del cliente
   - Exportación de reportes en PDF/Excel
   - Gráficos interactivos de tendencias

5. Sistema integrado de roles y permisos
   - Administrador: acceso total al sistema
   - Cajero: gestión de pagos y facturación
   - Chef/Cocina: vista optimizada de pedidos pendientes
   - Meseros: gestión de mesas y pedidos asignados
   - Configuración flexible de permisos personalizados

Beneficios operativos:
- Reducción de errores en toma de pedidos
- Mejor coordinación entre áreas
- Optimización de tiempos de preparación
- Control preciso de ventas e inventario
- Mejora en la experiencia del cliente
- Datos para toma de decisiones

## Contribuir
1. Fork -> crear rama `feature/tu-cambio` -> PR.
2. Incluye descripción clara y pasos para probar.
3. Añade tests cuando cambies lógica.

## Licencia y contacto
- Autor: zcrypt83 (https://github.com/zcrypt83)
- Repo: https://github.com/zcrypt83/delicias-restaurant
- Página publicada: https://zcrypt83.github.io/delicias-restaurant/
