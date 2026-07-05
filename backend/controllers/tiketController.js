const pool = require('../config/db');

exports.getBookedSeats = async (req, res) => {
  const { jadwalId } = req.params;
  
  // Validasi jadwalId
  if (!jadwalId || isNaN(jadwalId)) {
    return res.status(400).json({ error: 'ID jadwal tidak valid' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT nomor_kursi FROM tiket WHERE id_jadwal = ?',
      [parseInt(jadwalId)]
    );
    
    // Kembalikan array nomor kursi
    const booked = rows.map(r => r.nomor_kursi);
    res.json(booked);
  } catch (err) {
    console.error('Error getting booked seats:', err);
    res.status(500).json({ error: err.message });
  }
};