#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de verificación y arranque para Delicias Restaurant
.DESCRIPTION
    Verifica que todo esté correctamente configurado e inicia la aplicación
#>

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        🍽️  DELICIAS RESTAURANT - VERIFICACIÓN             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

# 1. Verificar que estamos en la raíz
Write-Host "1️⃣  Verificando estructura..." -ForegroundColor Yellow
if (Test-Path "backend") {
    Write-Host "   ✓ Carpeta backend encontrada" -ForegroundColor Green
} else {
    Write-Host "   ✗ Ejecuta desde la raíz del proyecto" -ForegroundColor Red
    $allOk = $false
}

# 2. Verificar Node.js
Write-Host "2️⃣  Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = (node --version)
    Write-Host "   ✓ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js no encontrado" -ForegroundColor Red
    $allOk = $false
}

# 3. Verificar npm
Write-Host "3️⃣  Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = (npm --version)
    Write-Host "   ✓ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ npm no encontrado" -ForegroundColor Red
    $allOk = $false
}

# 4. Verificar sqlite3
Write-Host "4️⃣  Verificando SQLite..." -ForegroundColor Yellow
if (Test-Path "backend/node_modules/sqlite3") {
    Write-Host "   ✓ sqlite3 instalado" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  sqlite3 no instalado (necesario)" -ForegroundColor Yellow
    $allOk = $false
}

# 5. Verificar .env
Write-Host "5️⃣  Verificando configuración..." -ForegroundColor Yellow
if (Test-Path "backend/.env") {
    Write-Host "   ✓ backend/.env existe" -ForegroundColor Green
} else {
    Write-Host "   ✗ backend/.env no existe" -ForegroundColor Red
    $allOk = $false
}

# 6. Verificar BD
Write-Host "6️⃣  Verificando base de datos..." -ForegroundColor Yellow
if (Test-Path "backend/data/delicias.db") {
    Write-Host "   ✓ delicias.db existe" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  delicias.db no existe (se creará al iniciar)" -ForegroundColor Yellow
}

Write-Host ""

if ($allOk) {
    Write-Host "✅ Verificación completada!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Terminal 1 - Backend:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
    Write-Host "Terminal 2 - Frontend:" -ForegroundColor Yellow
    Write-Host "  cd frontend" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
    Write-Host "Luego: Abre http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "⚠️  Hay problemas que necesitan atención" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Soluciones:" -ForegroundColor Cyan
    Write-Host "1. Instala Node.js desde: https://nodejs.org" -ForegroundColor White
    Write-Host "2. En backend: npm install" -ForegroundColor White
    Write-Host ""
}

Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
