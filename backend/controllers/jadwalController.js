const pool = require('../config/db');

// GET jadwal berdasarkan film_id (optional)
exports.getJadwalByFilm = async (req, res) => {
  const { film_id } = req.query;
  try {
    let query = `
      SELECT j.*, f.judul 
      FROM jadwal j
      JOIN film f ON j.id_film = f.id_film
    `;
    const params = [];
    if (film_id && film_id !== 'all') {
      query += ' WHERE j.id_film = ?';
      params.push(parseInt(film_id));
    }
    query += ' ORDER BY j.tanggal DESC, j.jam ASC';
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error getting jadwal:', err);
    res.status(500).json({ error: err.message });
  }
};

// CREATE jadwal
exports.createJadwal = async (req, res) => {
  const { id_film, tanggal, jam } = req.body;
  if (!id_film || !tanggal || !jam) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO jadwal (id_film, tanggal, jam) VALUES (?, ?, ?)',
      [id_film, tanggal, jam]
    );
    res.status(201).json({ 
      id_jadwal: result.insertId, 
      id_film, 
      tanggal, 
      jam 
    });
  } catch (err) {
    console.error('Error creating jadwal:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE jadwal
exports.updateJadwal = async (req, res) => {
  const { id } = req.params;
  const { tanggal, jam } = req.body;
  if (!tanggal || !jam) {
    return res.status(400).json({ error: 'Tanggal dan jam wajib diisi' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE jadwal SET tanggal = ?, jam = ? WHERE id_jadwal = ?',
      [tanggal, jam, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    }
    res.json({ message: 'Jadwal berhasil diupdate' });
  } catch (err) {
    console.error('Error updating jadwal:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE jadwal
exports.deleteJadwal = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM jadwal WHERE id_jadwal = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    }
    res.json({ message: 'Jadwal dihapus' });
  } catch (err) {
    console.error('Error deleting jadwal:', err);
    res.status(500).json({ error: err.message });
  }
};