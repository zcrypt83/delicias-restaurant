const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, admin } = require('../middleware/auth');

// Create a new reservation
router.post('/', async (req, res) => {
  const { name, email, phone, reservation_date, number_of_guests } = req.body;
  const user_id = req.user ? req.user.id : null; 

  if (!name || !email || !reservation_date || !number_of_guests) {
    return res.status(400).json({ error: 'Name, email, reservation date, and number of guests are required' });
  }

  try {
    const result = await db.run(
      'INSERT INTO reservations (user_id, name, email, phone, reservation_date, number_of_guests) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, name, email, phone, reservation_date, number_of_guests]
    );
    res.status(201).json({ id: result.insertId, message: 'Reservation created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error creating reservation' });
  }
});

// Get all reservations (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const [reservations] = await db.query('SELECT * FROM reservations ORDER BY reservation_date DESC');
    res.json(reservations || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching reservations' });
  }
});

// Get user's reservations
router.get('/my-reservations', auth, async (req, res) => {
  try {
    const [reservations] = await db.query('SELECT * FROM reservations WHERE user_id = ? ORDER BY reservation_date DESC', [req.user.id]);
    res.json(reservations || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching reservations' });
  }
});

// Update reservation status (admin)
router.patch('/:id/status', [auth, admin], async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    const allowedStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        await db.run(
            'UPDATE reservations SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({ message: `Reservation status updated to ${status}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error updating reservation status' });
    }
});

// Delete a reservation
router.delete('/:id', [auth, admin], async (req, res) => {
    const { id } = req.params;
    
    try {
        await db.run('DELETE FROM reservations WHERE id = ?', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error deleting reservation' });
    }
});

module.exports = router;
