const pool = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [totalFilm] = await pool.query('SELECT COUNT(*) AS total FROM film');
    const [totalPemesanan] = await pool.query('SELECT COUNT(*) AS total FROM pemesanan');
    const [totalPendapatan] = await pool.query('SELECT SUM(total_harga) AS total FROM pemesanan');
    const [totalPembeli] = await pool.query('SELECT COUNT(*) AS total FROM pembeli');
    res.json({
      totalFilm: totalFilm[0].total,
      totalPemesanan: totalPemesanan[0].total,
      totalPendapatan: totalPendapatan[0].total || 0,
      totalPembeli: totalPembeli[0].total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};