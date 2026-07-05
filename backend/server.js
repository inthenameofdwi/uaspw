require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/films', require('./routes/filmRoutes'));
app.use('/api/jadwal', require('./routes/jadwalRoutes'));
app.use('/api/pemesanan', require('./routes/pemesananRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tiket', require('./routes/tiketRoutes'));
const auth = require('./middleware/auth');
app.use('/api/pemesanan', auth); // middleware auth untuk semua method di /api/pemesanan
app.use('/api/pemesanan', require('./routes/pemesananRoutes'));

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend berjalan di http://localhost:${PORT}`);
});