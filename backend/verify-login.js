#!/usr/bin/env node

/**
 * Script de prueba para verificar que los usuarios pueden iniciar sesión
 * Prueba rápida: node verify-login.js
 */

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'delicias.db');

const TEST_CREDENTIALS = [
  { email: 'admin@delicias.com', password: 'admin123' },
  { email: 'cocinero@delicias.com', password: 'cocinero123' },
  { email: 'mesero@delicias.com', password: 'mesero123' },
  { email: 'cajero@delicias.com', password: 'cajero123' },
  { email: 'cliente@delicias.com', password: 'cliente123' },
];

async function testLogin() {
  console.log('🧪 Verificando credenciales de usuarios...\n');

  const db = new sqlite3.Database(dbPath, async (err) => {
    if (err) {
      console.error('❌ Error conectando a la base de datos:', err.message);
      process.exit(1);
    }

    let tested = 0;
    let passed = 0;
    let failed = 0;

    for (const cred of TEST_CREDENTIALS) {
      try {
        db.get(
          'SELECT id, name, email, password, role FROM users WHERE email = ?',
          [cred.email],
          async (err, user) => {
            if (err) {
              console.error(`❌ ${cred.email}: Error en BD -`, err.message);
              failed++;
            } else if (!user) {
              console.error(`❌ ${cred.email}: Usuario no encontrado`);
              failed++;
            } else {
              try {
                const isMatch = await bcrypt.compare(cred.password, user.password);
                if (isMatch) {
                  console.log(`✅ ${cred.email}: LOGIN EXITOSO (${user.role})`);
                  passed++;
                } else {
                  console.error(`❌ ${cred.email}: Contraseña incorrecta`);
                  failed++;
                }
              } catch (err) {
                console.error(`❌ ${cred.email}: Error verificando contraseña -`, err.message);
                failed++;
              }
            }

            tested++;
            if (tested === TEST_CREDENTIALS.length) {
              console.log(`\n📊 Resultado: ${passed}/${TEST_CREDENTIALS.length} usuarios pueden iniciar sesión`);
              if (failed === 0) {
                console.log('✅ Todos los usuarios están listos para iniciar sesión!');
              } else {
                console.log(`⚠️  ${failed} usuario(s) tienen problemas`);
              }
              db.close();
              process.exit(failed > 0 ? 1 : 0);
            }
          }
        );
      } catch (err) {
        console.error(`❌ Error procesando ${cred.email}:`, err.message);
        tested++;
        failed++;

        if (tested === TEST_CREDENTIALS.length) {
          console.log(`\n📊 Resultado: ${passed}/${TEST_CREDENTIALS.length} usuarios`);
          db.close();
          process.exit(1);
        }
      }
    }
  });
}

testLogin();
