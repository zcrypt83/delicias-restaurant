const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, admin } = require('../middleware/auth');

// Helper to emit current menu to connected clients
async function emitMenuUpdate(req) {
  try {
    const io = req.app && req.app.get('io');
    if (!io) return;
    const [rows] = await db.query('SELECT id, name, description, price, category, image, is_available FROM products ORDER BY created_at DESC');
    io.emit('menuUpdated', rows || []);
  } catch (err) {
    console.error('Error emitting menu update:', err.message);
  }
}
// Get all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, description, price, category, image, is_available FROM products ORDER BY created_at DESC');
    res.json(rows || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Create a new product
router.post('/', [auth, admin], async (req, res) => {
  const { name, description, price, category, image, is_available = true } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price and category are required' });
  }

  try {
    const result = await db.run(
      'INSERT INTO products (name, description, price, category, image, is_available) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, category, image, is_available]
    );
    const created = { id: result.insertId, name, description, price, category, image, is_available };
    // Emit updated menu to clients
    await emitMenuUpdate(req);
    res.status(201).json(created);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error creating product' });
  }
});

// Update a product (supports partial updates)
router.put('/:id', [auth, admin], async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  const { name, description, price, category, image, is_available } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    // Fetch existing product to ensure it exists
    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) updateFields.price = price;
    if (category !== undefined) updateFields.category = category;
    if (image !== undefined) updateFields.image = image;
    if (is_available !== undefined) updateFields.is_available = is_available;

    const fields = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateFields);

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    await db.run(
      `UPDATE products SET ${fields} WHERE id = ?`,
      [...values, id]
    );

    // Fetch the updated product to return it
    const [updatedRows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    // Emit updated menu
    await emitMenuUpdate(req);
    res.json(updatedRows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete a product
router.delete('/:id', [auth, admin], async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  
  try {
    await db.run('DELETE FROM products WHERE id = ?', [id]);
    // Emit updated menu
    await emitMenuUpdate(req);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

module.exports = router;
