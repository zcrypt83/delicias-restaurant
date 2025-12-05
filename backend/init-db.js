const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Datos de usuarios por defecto
const DEFAULT_USERS = [
  { name: 'Admin', email: 'admin@delicias.com', password: 'admin123', role: 'admin' },
  { name: 'Cocinero', email: 'cocinero@delicias.com', password: 'cocinero123', role: 'cocinero' },
  { name: 'Mesero', email: 'mesero@delicias.com', password: 'mesero123', role: 'mesero' },
  { name: 'Cajero', email: 'cajero@delicias.com', password: 'cajero123', role: 'cajero' },
  { name: 'Cliente', email: 'cliente@delicias.com', password: 'cliente123', role: 'customer' },
];

async function initializeDatabase() {
  const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'delicias.db');
  const dataDir = path.dirname(dbPath);

  // Crear directorio data si no existe
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`✓ Directorio creado: ${dataDir}`);
  }

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        reject(err);
        return;
      }

      console.log('✓ Conectado a base de datos SQLite:', dbPath);

      // Habilitar foreign keys
      db.run('PRAGMA foreign_keys = ON', async (err) => {
        if (err) {
          console.error('Error enabling foreign keys:', err);
          reject(err);
          return;
        }

        // Leer y ejecutar el schema
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Ejecutar cada comando SQL por separado
        const commands = schema.split(';').filter(cmd => cmd.trim());

        let completed = 0;
        let errors = [];

        commands.forEach((command) => {
          if (command.trim()) {
            db.exec(command, (err) => {
              if (err) {
                console.error(`✗ Error en comando: ${command.substring(0, 50)}...`);
                errors.push(err);
              } else {
                console.log(`✓ ${command.substring(0, 50)}...`);
              }
              completed++;

              if (completed === commands.length) {
                if (errors.length === 0) {
                  console.log('\n✅ Esquema de base de datos creado!');
                  // Insertar usuarios por defecto
                  insertDefaultUsers(db, resolve, reject);
                } else {
                  console.error('\n❌ Hubo errores durante la inicialización');
                  db.close();
                  reject(errors[0]);
                }
              }
            });
          }
        });
      });
    });
  });
}

async function insertDefaultUsers(db, resolve, reject) {
  try {
    // Limpiar usuarios existentes
    db.run('DELETE FROM users', async (err) => {
      if (err) {
        console.error('Error limpiando usuarios:', err);
        db.close();
        reject(err);
        return;
      }

      if (true) {  // Siempre insertar usuarios por defecto
        console.log('\n📝 Insertando usuarios por defecto...');
        let inserted = 0;
        let insertErrors = [];

        for (const user of DEFAULT_USERS) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            db.run(
              'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
              [user.name, user.email, hashedPassword, user.role],
              (err) => {
                if (err) {
                  console.error(`✗ Error insertando ${user.email}:`, err.message);
                  insertErrors.push(err);
                } else {
                  console.log(`✓ Usuario creado: ${user.email} (${user.role})`);
                }
                inserted++;

                if (inserted === DEFAULT_USERS.length) {
                  if (insertErrors.length === 0) {
                    console.log('\n✅ Base de datos inicializada exitosamente!');
                    console.log('\n📋 CREDENCIALES DE PRUEBA:');
                    console.log('  Admin:     admin@delicias.com / admin123');
                    console.log('  Cocinero:  cocinero@delicias.com / cocinero123');
                    console.log('  Mesero:    mesero@delicias.com / mesero123');
                    console.log('  Cajero:    cajero@delicias.com / cajero123');
                    console.log('  Cliente:   cliente@delicias.com / cliente123');
                    db.close();
                    resolve();
                  } else {
                    console.error('\n❌ Hubo errores insertando usuarios');
                    db.close();
                    reject(insertErrors[0]);
                  }
                }
              }
            );
          } catch (err) {
            console.error(`✗ Error procesando ${user.email}:`, err.message);
            insertErrors.push(err);
            inserted++;

            if (inserted === DEFAULT_USERS.length) {
              db.close();
              reject(insertErrors[0]);
            }
          }
        }
      }
    });
  } catch (err) {
    console.error('Error en insertDefaultUsers:', err.message);
    db.close();
    reject(err);
  }
}

initializeDatabase()
  .then(() => {
    console.log('✓ Inicialización completada');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
