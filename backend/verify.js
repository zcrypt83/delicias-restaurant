#!/usr/bin/env node

/**
 * Script de Verificación - Delicias Restaurant
 * Verifica que todo esté configurado correctamente
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function check(condition, successMsg, errorMsg) {
  if (condition) {
    log(`✓ ${successMsg}`, 'green');
    return true;
  } else {
    log(`✗ ${errorMsg}`, 'red');
    return false;
  }
}

async function main() {
  log('\n' + '='.repeat(50), 'cyan');
  log(' Verificación de Configuración', 'bold');
  log('='.repeat(50) + '\n', 'cyan');

  let passed = 0;
  let failed = 0;

  // 1. Verificar estructura de directorios
  log('1. Verificando estructura de directorios...', 'bold');
  const dirs = ['backend', 'frontend', 'backend/src', 'backend/db'];
  for (const dir of dirs) {
    if (check(fs.existsSync(dir), `${dir} existe`, `${dir} NO existe`)) {
      passed++;
    } else {
      failed++;
    }
  }

  // 2. Verificar archivos críticos
  log('\n2. Verificando archivos críticos...', 'bold');
  const files = [
    { path: 'backend/.env', required: false },
    { path: 'backend/.env.example', required: true },
    { path: 'backend/package.json', required: true },
    { path: 'backend/src/index.js', required: true },
    { path: 'backend/db/schema.sql', required: true },
    { path: 'backend/init-db.js', required: true },
    { path: 'frontend/package.json', required: true },
  ];

  for (const file of files) {
    const exists = fs.existsSync(file.path);
    const required = file.required ? ' [REQUERIDO]' : '';
    if (check(exists, `${file.path} existe${required}`, `${file.path} NO existe${required}`)) {
      passed++;
    } else {
      failed++;
    }
  }

  // 3. Verificar .env
  log('\n3. Verificando configuración (.env)...', 'bold');
  if (fs.existsSync('backend/.env')) {
    const envContent = fs.readFileSync('backend/.env', 'utf-8');
    check(envContent.includes('DB_HOST'), 'DB_HOST configurado', 'DB_HOST NO configurado') ? passed++ : failed++;
    check(envContent.includes('DB_PORT'), 'DB_PORT configurado', 'DB_PORT NO configurado') ? passed++ : failed++;
    check(envContent.includes('DB_NAME'), 'DB_NAME configurado', 'DB_NAME NO configurado') ? passed++ : failed++;
  } else {
    log('⚠ Archivo .env no existe (usando valores por defecto)', 'yellow');
  }

  // 4. Verificar Node.js
  log('\n4. Verificando Node.js...', 'bold');
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
    check(true, `Node.js ${nodeVersion} instalado`, '') ? passed++ : failed++;
  } catch (err) {
    check(false, '', 'Node.js NO está instalado') ? passed++ : failed++;
  }

  // 5. Verificar npm
  log('\n5. Verificando npm...', 'bold');
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
    check(true, `npm ${npmVersion} instalado`, '') ? passed++ : failed++;
  } catch (err) {
    check(false, '', 'npm NO está instalado') ? passed++ : failed++;
  }

  // 6. Verificar dependencias instaladas
  log('\n6. Verificando dependencias del backend...', 'bold');
  if (fs.existsSync('backend/node_modules')) {
    const packages = ['express', 'mysql2', 'bcryptjs', 'jsonwebtoken', 'cors'];
    for (const pkg of packages) {
      const exists = fs.existsSync(`backend/node_modules/${pkg}`);
      check(exists, `${pkg} instalado`, `${pkg} NO instalado`) ? passed++ : failed++;
    }
  } else {
    log('⚠ node_modules no existe en backend. Ejecuta: cd backend && npm install', 'yellow');
  }

  // 7. Verificar MySQL
  log('\n7. Verificando MySQL...', 'bold');
  try {
    execSync('mysql --version', { encoding: 'utf-8' });
    check(true, 'MySQL CLI instalado', '') ? passed++ : failed++;
  } catch (err) {
    log('⚠ MySQL CLI no encontrado (puedes usar XAMPP)', 'yellow');
  }

  // 8. Verificar conectividad de puertos
  log('\n8. Verificando puertos...', 'bold');
  
  try {
    // Verificar puerto 3306 (MySQL)
    const portCheck = execSync('netstat -an | findstr 3306', { encoding: 'utf-8' });
    check(portCheck.includes('LISTENING'), 'Puerto 3306 (MySQL) disponible', 'Puerto 3306 NO está escuchando') ? passed++ : failed++;
  } catch (err) {
    log('⚠ MySQL no está corriendo en puerto 3306', 'yellow');
  }

  // Resumen
  log('\n' + '='.repeat(50), 'cyan');
  log(` Resumen: ${colors.green}${passed} OK${colors.reset} | ${colors.red}${failed} Errores${colors.reset}`, 'bold');
  log('='.repeat(50) + '\n', 'cyan');

  if (failed === 0) {
    log('✓ ¡Todo está configurado correctamente!', 'green');
    log('\nPróximos pasos:', 'bold');
    log('1. Asegúrate de que MySQL está corriendo');
    log('2. cd backend && npm run init-db');
    log('3. npm start (en backend)');
    log('4. npm start (en frontend)');
  } else {
    log('⚠ Hay algunos problemas que necesitan atención', 'yellow');
    log('\nPara más ayuda, lee: README_REGISTRO_SOLUCION.md', 'cyan');
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  log(`Error: ${err.message}`, 'red');
  process.exit(1);
});
