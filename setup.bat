@echo off
REM Script para inicializar el proyecto Delicias Restaurant
REM Uso: setup.bat

echo ================================================
echo  Inicializando Delicias Restaurant
echo ================================================

REM Verificar que estamos en el directorio correcto
if not exist "backend" (
    echo Error: Ejecuta este script desde la raiz del proyecto
    exit /b 1
)

echo.
echo [1/4] Instalando dependencias del backend...
cd backend
call npm install
if errorlevel 1 (
    echo Error: Fallo al instalar dependencias del backend
    exit /b 1
)

echo.
echo [2/4] Inicializando base de datos...
call npm run init-db
if errorlevel 1 (
    echo.
    echo ADVERTENCIA: No se pudo conectar a MySQL
    echo Asegurate de que MySQL este corriendo en 127.0.0.1:3306
    echo Luego ejecuta: npm run init-db
)

cd ..

echo.
echo [3/4] Instalando dependencias del frontend...
cd frontend
call npm install
if errorlevel 1 (
    echo Error: Fallo al instalar dependencias del frontend
    exit /b 1
)

cd ..

echo.
echo ================================================
echo  Setup completado!
echo ================================================
echo.
echo Para iniciar la aplicacion:
echo.
echo En una terminal (backend):
echo   cd backend
echo   npm start
echo.
echo En otra terminal (frontend):
echo   cd frontend
echo   npm start
echo.
echo Luego abre: http://localhost:3000
echo.
