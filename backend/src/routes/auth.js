const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register a new user (force role to 'customer')
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  const role = 'customer';

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    // Verificar si el usuario ya existe
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users && users.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar nuevo usuario
    const result = await db.run(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, role]
    );

    const token = jwt.sign({ id: result.insertId, role: role }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: { id: result.insertId, name, email, phone, role } });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = router;
