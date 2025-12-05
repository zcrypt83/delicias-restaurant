# 🍽️ DELICIAS RESTAURANT - GUÍA RÁPIDA DE REGISTRO

## 🎯 El Problema
```
❌ Al registrarse, no se registra y muestra error
```

## 🔍 Causa Principal
```
MySQL no está corriendo → Backend no puede conectar → Error de registro
```

---

## ✅ SOLUCIÓN RÁPIDA (5 minutos)

### 1️⃣ Abre XAMPP y **START MySQL**
```
XAMPP Control Panel
└─ MySQL → [START] ← Debe estar en VERDE
```

### 2️⃣ Inicializa la BD
```powershell
cd backend
npm run init-db
```

### 3️⃣ Inicia los servidores (en 2 terminales)

**Terminal 1:**
```powershell
cd backend
npm start
```

**Terminal 2:**
```powershell
cd frontend
npm start
```

### 4️⃣ Prueba el registro
- Abre http://localhost:3000
- Clic en "Crear Cuenta"
- Rellena el formulario
- ¡Listo! ✓

---

## 🔧 Si Algo Falla

```
Error: ECONNREFUSED
├─ Causa: MySQL no está corriendo
└─ Solución: START MySQL en XAMPP

Error: Access Denied
├─ Causa: Contraseña MySQL incorrecta
└─ Solución: Edita backend/.env → DB_PASSWORD

Error: Unknown Database
├─ Causa: BD no fue inicializada
└─ Solución: npm run init-db

Error: Can't connect to backend
├─ Causa: Backend no está corriendo
└─ Solución: npm start en backend
```

---

## 📋 Verificación

Ejecuta en backend:
```powershell
npm run verify
```

Debe mostrarte todo ✓ en verde

---

## 📁 Archivos Creados

✅ **backend/.env** - Configuración de BD  
✅ **backend/init-db.js** - Script de inicialización  
✅ **backend/verify.js** - Script de verificación  
✅ **setup.ps1** - Setup automático  
✅ **README_REGISTRO_SOLUCION.md** - Guía completa  

---

## 🎓 Documentación Completa

- **README_REGISTRO_SOLUCION.md** ← Lee esto si necesitas más detalles
- **CONFIGURACION_AVANZADA.md** ← Para configuraciones especiales
- **DIAGNOSTICO_REGISTRO.md** ← Para diagnósticos

---

## 🚀 Una vez que funcione

Podrás:
- ✓ Registrarte
- ✓ Iniciar sesión
- ✓ Ver menú digital
- ✓ Hacer pedidos
- ✓ Hacer reservaciones
- ✓ Panel de administración

---

## 💡 Tips

**Ejecuta esto en cualquier terminal para verificar:**
```powershell
# Ver si MySQL está corriendo
netstat -an | findstr "3306"

# Ver si Backend está corriendo
Invoke-WebRequest http://localhost:5000/api/health
```

**Para limpiar y empezar de cero:**
```powershell
# En backend:
npm run init-db  # Recrea tablas (BORRA datos anteriores)
```

---

## 📞 Resumen de Puertos

| Servicio | URL | Puerto |
|----------|-----|--------|
| Frontend | http://localhost:3000 | 3000 |
| Backend | http://localhost:5000 | 5000 |
| MySQL | 127.0.0.1 | 3306 |

---

✨ **¡Ya está todo listo! Solo necesitas MySQL corriendo.** ✨

