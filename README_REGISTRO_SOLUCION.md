# 🚨 SOLUCIÓN: Error de Registro en Delicias Restaurant

## El Problema
Al intentar registrarse, el usuario no se registra correctamente y se muestra un error.

## Causa Raíz
**MySQL no está corriendo** - El servidor backend no puede conectarse a la base de datos MySQL porque el servicio no está iniciado.

---

## ✅ Solución Paso a Paso

### **Paso 1: Asegurar que MySQL está Corriendo**

#### Opción A: Usando XAMPP (Recomendado)
1. Abre **XAMPP Control Panel**
2. Busca la fila de "MySQL" 
3. Haz clic en **"Start"** (debe volverse verde)
4. Verifica que muestre el puerto 3306

#### Opción B: Usando WAMP
1. Haz clic en el ícono de WAMP en la bandeja
2. Selecciona "Start All Services"
3. Espera a que todo esté en verde

#### Opción C: MySQL Service (si lo instalaste como servicio)
En PowerShell (como administrador):
```powershell
Start-Service MySQL80  # o el nombre de tu servicio
```

#### Opción D: Verificar que MySQL está Corriendo
```powershell
# En PowerShell o CMD:
netstat -an | findstr "3306"
# Debe mostrar: TCP 127.0.0.1:3306 LISTENING
```

---

### **Paso 2: Configurar el Backend**

El archivo `.env` ya fue creado en `backend/.env` con:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=delicias_db
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
```

**Si tu MySQL tiene contraseña, actualiza `DB_PASSWORD`**

---

### **Paso 3: Inicializar la Base de Datos**

Ahora que MySQL está corriendo, inicializa las tablas:

```powershell
cd backend
npm run init-db
```

✅ **Debe mostrar:**
```
Creating database if not exists...
Executing: CREATE TABLE IF NOT EXISTS `users`...
Executing: CREATE TABLE IF NOT EXISTS `products`...
...
Database initialized successfully!
```

---

### **Paso 4: Iniciar los Servidores**

#### Terminal 1: Backend
```powershell
cd backend
npm start
```

Debe mostrar:
```
Delicias backend listening on port 5000
```

#### Terminal 2: Frontend
```powershell
cd frontend
npm start
```

Debe abrir `http://localhost:3000` automáticamente

---

### **Paso 5: Probar el Registro**

1. Ve a http://localhost:3000
2. Haz clic en **"Crear Cuenta"**
3. Completa el formulario con:
   - Nombre: Juan Pérez
   - Email: juan@ejemplo.com
   - Teléfono: 987654321
   - Contraseña: Test123@
   - Confirmar: Test123@
4. Haz clic en **"Crear Cuenta"**

---

## 🔧 Verificación de Conectividad

### Verificar Backend
```powershell
Invoke-WebRequest http://localhost:5000/api/health
# Debe devolver: @{db=True}
```

### Verificar Base de Datos Directamente
```powershell
# Conectar a MySQL:
mysql -h 127.0.0.1 -u root

# Dentro de MySQL:
USE delicias_db;
SELECT * FROM users;
```

---

## ❌ Si Aún No Funciona

### Error: `ECONNREFUSED`
- **Causa**: MySQL no está corriendo
- **Solución**: Inicia MySQL (ver Paso 1)

### Error: `Access Denied for user 'root'@'localhost'`
- **Causa**: Contraseña de MySQL incorrecta
- **Solución**: Actualiza `DB_PASSWORD` en `backend/.env`

### Error: `Unknown Database 'delicias_db'`
- **Causa**: Base de datos no fue inicializada
- **Solución**: Ejecuta `npm run init-db` en el backend

### Error: `CORS error` en el navegador
- **Causa**: Backend no está corriendo
- **Solución**: Asegúrate de ejecutar `npm start` en el backend

### Error: `Port 3000 is already in use`
- **Solución**: 
  ```powershell
  # Encuentra qué proceso usa el puerto 3000
  netstat -an | findstr "3000"
  
  # O mata el proceso:
  Stop-Process -Id <PID> -Force
  ```

---

## 📋 Checklist Final

- [ ] MySQL está corriendo (puedo verlo verde en XAMPP)
- [ ] Ejecuté `npm run init-db` sin errores
- [ ] Backend está en http://localhost:5000 ✓
- [ ] Frontend está en http://localhost:3000 ✓
- [ ] Puedo ver una tabla en `/users` después de registrar
- [ ] El token se guarda en localStorage

---

## 🚀 Automatización (Opcional)

Ejecuta el script de setup para automatizar todo:

```powershell
# En la raíz del proyecto:
.\setup.ps1
```

O en CMD:
```cmd
setup.bat
```

---

## 📞 Flujo de Funcionamiento Correcto

```
1. Usuario entra a http://localhost:3000
2. Hace clic en "Crear Cuenta"
3. Completa el formulario
4. Frontend envía: POST http://localhost:5000/api/auth/register
5. Backend recibe, valida, encripta contraseña
6. Backend inserta en tabla `users` de MySQL
7. Backend devuelve token JWT
8. Frontend guarda token en localStorage
9. Frontend redirige a la página principal
10. Usuario está autenticado ✓
```

---

## 🎉 ¡Listo!

Una vez que todo funcione, podrás:
- ✅ Registrar nuevos usuarios
- ✅ Iniciar sesión
- ✅ Acceder a diferentes roles (Admin, Cocinero, Mesero, Cajero, Cliente)
- ✅ Ver el menú digital
- ✅ Hacer pedidos
- ✅ Hacer reservaciones

¡Que disfrutes de Delicias! 🍽️

