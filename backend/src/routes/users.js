const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, admin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC');
    res.json(rows || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Get single user by ID (admin only)
router.get('/:id', [auth, admin], async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update a user (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const { name, email, phone, role } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    // Verify user exists
    const [existing] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (role !== undefined) updateFields.role = role;

    const fields = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateFields);

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    await db.run(
      `UPDATE users SET ${fields} WHERE id = ?`,
      [...values, id]
    );

    // Fetch the updated user
    const [updatedRows] = await db.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [id]);
    res.json(updatedRows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete a user (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    // Prevent deletion of admin users
    const [user] = await db.query('SELECT role FROM users WHERE id = ?', [id]);
    if (user && user.length > 0 && user[0].role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    await db.run('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
