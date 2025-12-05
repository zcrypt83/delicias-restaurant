const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, admin } = require('../middleware/auth');

// Create a new order
router.post('/', auth, async (req, res) => {
  const { items, total, table_number } = req.body;
  const user_id = req.user.id; 

  if (!items || items.length === 0 || !total) {
    return res.status(400).json({ error: 'Items and total are required' });
  }

  try {
    // Insertar la orden
    const orderResult = await db.run(
      'INSERT INTO orders (user_id, table_number, total, status) VALUES (?, ?, ?, ?)',
      [user_id, table_number, total, 'pending']
    );
    const orderId = orderResult.insertId;

    // Insertar items de la orden
    for (const item of items) {
      await db.run(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    res.status(201).json({ orderId, message: 'Order created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Get all orders (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(orders || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(orders[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// Update order status (admin)
router.patch('/:id/status', [auth, admin], async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    const allowedStatuses = ['pending', 'preparing', 'completed', 'cancelled', 'delivered'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        await db.run(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({ message: `Order status updated to ${status}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error updating order status' });
    }
});

module.exports = router;
