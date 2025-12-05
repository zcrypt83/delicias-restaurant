# 🎨 Panel de Administrador - Guía Rápida

## ✨ Nuevas Funcionalidades

El panel de administrador ahora incluye dos nuevos módulos:

### 1️⃣ **Gestión de Productos** (📦)
Administra el menú completo del restaurante.

**Funciones:**
- ✅ Ver todos los productos
- ✅ Crear nuevos productos
- ✅ Editar productos existentes
- ✅ Eliminar productos
- ✅ Marcar como disponible/agotado
- ✅ Buscar por nombre o categoría

**Campos:**
```
- Nombre (requerido)
- Descripción (opcional)
- Precio (requerido)
- Categoría (Platos, Bebidas, Postres, Entradas)
- Emoji/Imagen
- Disponibilidad (Sí/No)
```

---

### 2️⃣ **Gestión de Clientes** (👥)
Administra todos los usuarios y empleados del sistema.

**Funciones:**
- ✅ Ver todos los clientes/usuarios
- ✅ Crear nuevos usuarios
- ✅ Editar información de usuario
- ✅ Eliminar usuarios (excepto admins)
- ✅ Asignar roles
- ✅ Buscar por nombre o email

**Campos:**
```
- Nombre (requerido)
- Email (requerido)
- Teléfono (opcional)
- Rol: Cliente, Mesero, Cocinero, Cajero, Admin
```

**Roles disponibles:**
```
👤 Cliente      - Realiza pedidos
👨‍🍳 Cocinero    - Gestiona órdenes de cocina
🚴 Mesero       - Atiende a clientes
💳 Cajero       - Gestiona pagos
🔐 Admin        - Acceso total
```

---

## 🚀 Cómo Usar

### Paso 1: Acceder al Panel
1. Inicia sesión con credenciales admin:
   - **Email:** `admin@delicias.com`
   - **Contraseña:** `admin123`
2. Se abrirá automáticamente el Panel de Administrador

### Paso 2: Navegar a Productos o Clientes
- Haz clic en el tab "📦 Productos" o "👥 Clientes"

### Paso 3: Crear
- Haz clic en "+ Nuevo Producto" o "+ Nuevo Cliente"
- Completa los campos requeridos (marcados con *)
- Haz clic en "Guardar"

### Paso 4: Editar
- Haz clic en el botón "Editar" en la fila correspondiente
- Modifica los datos
- Haz clic en "Guardar"

### Paso 5: Eliminar
- Haz clic en el botón "Eliminar" en la fila correspondiente
- Confirma la eliminación cuando se pida

### Paso 6: Buscar
- Usa el campo de búsqueda en la parte superior
- Filtra por nombre, email o categoría
- Los resultados aparecen en tiempo real

---

## 📊 Estructura de Datos

### Producto ejemplo
```json
{
  "id": 1,
  "name": "Pizza Margarita",
  "description": "Pizza clásica con tomate y mozzarella",
  "price": 25.50,
  "category": "platos",
  "image": "🍕",
  "is_available": true
}
```

### Cliente/Usuario
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "1234567890",
  "role": "customer",
  "created_at": "2025-12-05T10:30:00"
}
```

---

## 🔐 Seguridad

- ✅ Solo admins pueden acceder a estos módulos
- ✅ No se pueden eliminar usuarios con rol admin
- ✅ Todos los datos se validan en el servidor
- ✅ Se requiere token JWT válido
- ✅ Los cambios se registran en la base de datos

---

## 🎯 Casos de Uso

### Ejemplo 1: Agregar un nuevo plato
1. Ve a "📦 Productos"
2. Haz clic en "+ Nuevo Producto"
3. Completa:
   - Nombre: "Ensalada César"
   - Descripción: "Ensalada fresca con pollo"
   - Precio: "18.90"
   - Categoría: "Platos"
   - Emoji: "🥗"
   - Disponible: ✓
4. Haz clic en "Guardar"

### Ejemplo 2: Crear un nuevo mesero
1. Ve a "👥 Clientes"
2. Haz clic en "+ Nuevo Cliente"
3. Completa:
   - Nombre: "Carlos López"
   - Email: "carlos@delicias.com"
   - Teléfono: "9876543210"
   - Rol: "Mesero"
4. Haz clic en "Guardar"

### Ejemplo 3: Cambiar rol de usuario
1. Ve a "👥 Clientes"
2. Busca el usuario: "cliente@delicias.com"
3. Haz clic en "Editar"
4. Cambia Rol de "Cliente" a "Cajero"
5. Haz clic en "Guardar"

---

## ⚠️ Restricciones

- ❌ No puedes eliminar usuarios con rol "admin"
- ❌ No puedes dejar vacíos los campos requeridos
- ❌ Los emails deben ser únicos
- ❌ Los precios deben ser números positivos

---

## 🐛 Solución de Problemas

### Los cambios no se guardan
- Verifica que hayas completado todos los campos requeridos
- Revisa que el token JWT siga siendo válido
- Intenta refrescar la página

### No puedo ver los datos
- Asegúrate de estar logueado como admin
- Verifica que el backend esté corriendo
- Revisa la consola del navegador para mensajes de error

### Faltan datos después de guardar
- Solo se guardan los campos completados
- Los campos opcionales pueden estar vacíos
- Recarga la página para ver los cambios

---

## 📱 Responsividad

La interfaz se adapta a diferentes tamaños de pantalla:
- ✅ Escritorio (1920px+)
- ✅ Laptop (1024px+)
- ✅ Tablet (768px+)
- ✅ Móvil (375px+)

---

## 💾 Datos de Prueba

Si necesitas datos para probar, usa estos usuarios predefinidos:

```
Admin:     admin@delicias.com / admin123
Cocinero:  cocinero@delicias.com / cocinero123
Mesero:    mesero@delicias.com / mesero123
Cajero:    cajero@delicias.com / cajero123
Cliente:   cliente@delicias.com / cliente123
```

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs del backend en la terminal
2. Abre la consola del navegador (F12)
3. Verifica que ambos servidores estén corriendo
4. Intenta refrescar la página

---

**¡Disfruta gestionando tu restaurante! 🍽️**
