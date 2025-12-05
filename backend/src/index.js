const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const reservationRoutes = require('./routes/reservations');
const userRoutes = require('./routes/users');
const pool = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Delicias API is running' });
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);

// health check for DB
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as ok');
    res.json({ db: true });
  } catch (err) {
    res.status(500).json({ db: false, error: err.message });
  }
});

const port = process.env.PORT || 5000;

// Create HTTP server and attach Socket.IO so routes can emit events
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Make io accessible from routes via app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Delicias backend listening on port ${port}`);
});
