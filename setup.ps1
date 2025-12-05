# Script de inicialización para Delicias Restaurant
# Uso: .\setup.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host " Inicializando Delicias Restaurant" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "backend")) {
    Write-Host "Error: Ejecuta este script desde la raiz del proyecto" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[IMPORTANTE] Asegúrate de que MySQL esté corriendo" -ForegroundColor Yellow
Write-Host "Si usas XAMPP, activa: Apache y MySQL" -ForegroundColor Yellow
Write-Host ""

# 1. Backend
Write-Host "[1/4] Instalando dependencias del backend..." -ForegroundColor Cyan
Push-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Fallo al instalar dependencias del backend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/4] Intentando inicializar base de datos..." -ForegroundColor Cyan
npm run init-db
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  ADVERTENCIA: No se pudo conectar a MySQL" -ForegroundColor Yellow
    Write-Host "Verifica:" -ForegroundColor Yellow
    Write-Host "  1. MySQL está corriendo en 127.0.0.1:3306" -ForegroundColor Yellow
    Write-Host "  2. Usuario root sin contraseña o verifica .env" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Cuando hayas solucionado esto, ejecuta:" -ForegroundColor Yellow
    Write-Host "  npm run init-db" -ForegroundColor Yellow
}
Pop-Location

# 2. Frontend
Write-Host ""
Write-Host "[3/4] Instalando dependencias del frontend..." -ForegroundColor Cyan
Push-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Fallo al instalar dependencias del frontend" -ForegroundColor Red
    exit 1
}
Pop-Location

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host " ✓ Setup completado!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar la aplicacion:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Luego abre: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
