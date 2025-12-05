# 🎨 Sistema de Diseño Moderno - Documentación

## Descripción General

Se ha implementado un sistema de diseño moderno y completo para el frontend de Delicias Restaurant, incluyendo:

- **Tokens de diseño CSS** (colores, espaciado, sombras, transiciones)
- **Animaciones y transiciones** suaves
- **Componentes estilizados** (tarjetas, botones, modales, tablas, navegación)
- **Diseño responsivo** en todos los dispositivos
- **Soporte para modo oscuro** (prefers-color-scheme)

---

## Archivos de Estilo Creados

### 1. **`src/styles/variables.css`**
**Propósito**: Sistema centralizado de tokens de diseño

**Contenido**:
- Colores (primario, secundario, éxito, peligro, información)
- Gradientes (primario, peligro, éxito, información)
- Sombras (sm, md, lg, xl)
- Transiciones (rápida, base, lenta)
- Espaciado (xs a 2xl: 4px a 48px)
- Radio de bordes (sm a full)
- Z-index levels
- Media query para modo oscuro

**Uso**:
```css
background: var(--gradient-primary);
padding: var(--space-lg);
box-shadow: var(--shadow-md);
border-radius: var(--radius-lg);
transition: var(--transition-base);
```

### 2. **`src/styles/animations.css`** (Mejorado)
**Propósito**: Animaciones y transiciones reutilizables

**Animaciones Incluidas**:
- `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight`
- `scaleUp`, `scaleDown`
- `rotateIn`, `flip`, `swing`
- `glow`, `pulse`, `pulse-glow`
- `ripple`, `spin`, `slideDown`, `slideInRight`, `bounce`

**Clases de Utilidad**:
- `.fade-in`, `.fade-in-up`, `.scale-up`, `.rotate-in`
- `.glow-animation`, `.flip-animation`, `.pulse`

### 3. **`src/styles/ProductCard.css`**
**Propósito**: Estilos modernos para tarjetas de producto

**Características**:
- Efecto hover con elevación y sombra
- Imagen con zoom y rotación al pasar mouse
- Texto de precio con gradiente
- Badges animadas
- Botones con efecto ripple
- Variantes: destacado, sin stock
- Completamente responsivo

**Clases**:
- `.product-card` - Contenedor principal
- `.product-image` - Imagen con zoom
- `.product-price` - Precio con gradiente
- `.product-badge` - Badges animadas
- `.btn-add-cart` - Botón con ripple
- `.product-card.featured` - Variante destacada
- `.product-card.out-of-stock` - Variante sin stock

### 4. **`src/styles/Navigation.css`**
**Propósito**: Navegación y barra lateral modernas

**Componentes**:
- Barra lateral (sidebar) con gradiente
- Enlaces de navegación con indicador de estado activo
- Logo con efecto hover
- Perfil de usuario
- Modo colapsable
- Responsive para móviles

**Clases**:
- `.sidebar` - Contenedor de navegación
- `.nav-link` - Enlaces con animación
- `.nav-link.active` - Estado activo
- `.user-profile` - Sección de usuario

### 5. **`src/styles/Button.css`**
**Propósito**: Sistema completo de botones

**Variantes**:
- **Primario** (gradiente amarillo)
- **Secundario** (borde)
- **Peligro** (rojo)
- **Éxito** (verde)
- **Información** (azul)

**Tamaños**:
- `.btn-sm` - Pequeño
- `.btn` - Normal (default)
- `.btn-lg` - Grande
- `.btn-icon` - Circular para iconos
- `.btn-float` - Botón flotante fijo

**Efectos**:
- Ripple al hacer click
- Elevación al hover
- Estado de carga
- Estado deshabilitado

### 6. **`src/styles/Modal.css`**
**Propósito**: Diálogos y modales modernos

**Características**:
- Animación de entrada suave
- Header con gradiente
- Body con scroll personalizado
- Footer para acciones
- Variantes de tamaño (sm, lg, xl, fullscreen)
- Formularios integrados
- Indicadores de pasos para wizards
- Modales de alerta/confirmación

**Clases**:
- `.modal-content` - Contenedor
- `.modal-header` - Encabezado
- `.modal-body` - Contenido
- `.modal-footer` - Acciones
- `.modal-steps` - Para wizards multi-paso

### 7. **`src/styles/Cards.css`**
**Propósito**: Tarjetas y componentes de información

**Tipos de Tarjetas**:
- **Card General** - Tarjeta básica
- **Info Card** - Tarjeta de información con icono
- **Stat Card** - Estadísticas/métricas
- **Feature Card** - Características destacadas
- **Timeline** - Línea de tiempo

**Componentes**:
- **Badges** - Etiquetas con 6 variantes de color
- **Alerts** - Alertas con iconos
- **Status Indicators** - Indicadores de estado

### 8. **`src/styles/Tables.css`**
**Propósito**: Tablas modernas y responsivas

**Características**:
- Header con gradiente
- Filas con hover y efecto highlight
- Tabla rayada (striped)
- Encabezados ordenables (sortable)
- Filas expandibles
- Paginación integrada
- Responsive (se convierte en cards en móvil)
- Estado de carga y vacío
- Avatar en celdas
- Acciones con botones

### 9. **`src/styles/Footer.css`** (Mejorado)
**Propósito**: Pie de página moderno

**Características**:
- Degradado de fondo con decoraciones geométricas
- Logo con efecto hover
- Enlaces de redes sociales animadas
- Formulario de suscripción newsletter
- Información de contacto
- Botón "Volver arriba"
- Grid responsivo de secciones
- Animación de entrada escalonada

---

## Uso en Componentes

### Ejemplo 1: Importar Estilos en Componentes JSX

```jsx
import '../styles/ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} className="product-image" alt={product.name} />
      <h3 className="product-title">{product.name}</h3>
      <p className="product-price">${product.price}</p>
      <button className="btn btn-primary">
        Agregar al carrito
      </button>
    </div>
  );
}
```

### Ejemplo 2: Usar Variables CSS en Componentes Custom

```css
.my-component {
  padding: var(--space-lg);
  background: var(--bg-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.my-component:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
```

### Ejemplo 3: Usar Animaciones

```jsx
<div className="fade-in-up">
  <p>Contenido que aparece con animación</p>
</div>
```

```css
/* Custom */
.my-element {
  animation: slideInRight 0.4s ease-out;
}
```

---

## Colores Disponibles

### Paleta Principal
| Color | Variable | Valor |
|-------|----------|-------|
| Primario | `--primary` | #FFC107 |
| Primario Oscuro | `--primary-dark` | #FFB300 |
| Secundario | `--secondary` | #2C3E50 |
| Éxito | `--success` | #4CAF50 |
| Peligro | `--danger` | #FF6B6B |
| Información | `--info` | #2196F3 |
| Fondo Claro | `--bg-light` | #FFFFFF |
| Fondo Superficie | `--bg-surface` | #F5F5F5 |
| Texto Oscuro | `--text-dark` | #333333 |
| Texto Mutado | `--text-muted` | #999999 |

---

## Espaciado Scale

```css
--space-xs:  4px
--space-sm:  8px
--space-md:  12px
--space-lg:  16px
--space-xl:  24px
--space-2xl: 48px
```

---

## Sombras Disponibles

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12)
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15)
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.18)
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.25)
```

---

## Transiciones Predefinidas

```css
--transition-fast:  0.15s ease-out
--transition-base:  0.3s ease-out
--transition-slow:  0.5s ease-out
```

---

## Modo Oscuro

El sistema incluye soporte automático para modo oscuro. Los estilos se adaptan basados en:

```css
@media (prefers-color-scheme: dark) {
  /* Estilos para modo oscuro */
}
```

**Los usuarios con `prefers-color-scheme: dark` verán automáticamente:**
- Fondos oscuros
- Texto claro
- Colores ajustados para mejor contraste

---

## Pasos Siguientes

1. **Actualizar Componentes Existentes**: Reemplazar Bootstrap classes con las nuevas clases personalizadas donde sea posible.

2. **Crear Componentes React**: Usar los estilos CSS en nuevos componentes.

3. **Testing**: Verificar animaciones y transiciones en diferentes navegadores.

4. **Documentación de Componentes**: Crear ejemplos de uso para cada componente.

5. **Deployment**: Ejecutar `npm run deploy` para actualizar GitHub Pages.

---

## Ejemplos Prácticos

### Botón con Carga
```jsx
<button className={`btn btn-primary ${isLoading ? 'loading' : ''}`}>
  {isLoading ? 'Enviando...' : 'Enviar'}
</button>
```

### Alerta
```jsx
<div className="alert alert-success">
  <span className="alert-icon">✓</span>
  <div className="alert-content">
    <h5>¡Éxito!</h5>
    <p>La operación se completó correctamente.</p>
  </div>
</div>
```

### Tarjeta de Estadísticas
```jsx
<div className="stat-card">
  <div className="stat-number">1,234</div>
  <div className="stat-label">Órdenes Totales</div>
  <span className="stat-change positive">+12% este mes</span>
</div>
```

### Modal de Confirmación
```jsx
<div className="modal show d-block">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Confirmar</h5>
      </div>
      <div className="modal-body">
        <p>¿Estás seguro de que deseas continuar?</p>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary">Cancelar</button>
        <button className="btn btn-danger">Eliminar</button>
      </div>
    </div>
  </div>
</div>
```

---

## Soporte y Mantenimiento

- Todos los estilos usan CSS custom properties para fácil personalización
- Cambiar un valor en `variables.css` actualiza toda la aplicación
- Los estilos son modulares y pueden ser importados independientemente
- Compatible con Bootstrap 5 para componentes que aún lo usen

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0
