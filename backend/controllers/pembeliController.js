const pool = require('../config/db');

exports.getAllPembeli = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pembeli ORDER BY id_pembeli DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};