const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Crear conexión a SQLite
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/delicias.db');

// Crear directorio data si no existe
const fs = require('fs');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database:', dbPath);
  }
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

// Wrapper para usar promesas con SQLite
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve([rows]);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ insertId: this.lastID, changes: this.changes });
    });
  });
};

// Exportar métodos compatibles con mysql2
module.exports = {
  query,
  run,
  db,
  close: () => db.close()
};
