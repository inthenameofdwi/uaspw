const pool = require('../config/db');




// GET film yang memiliki jadwal (untuk booking)
exports.getFilmsWithSchedule = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT f.* 
      FROM film f 
      JOIN jadwal j ON f.id_film = j.id_film 
      WHERE j.tanggal >= CURDATE()
      ORDER BY f.judul
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET semua film (existing)
exports.getAllFilms = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM film ORDER BY id_film DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET film by id (existing)
exports.getFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM film WHERE id_film = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Film tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET film yang memiliki jadwal (existing)
exports.getFilmsWithSchedule = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT f.* 
      FROM film f 
      JOIN jadwal j ON f.id_film = j.id_film 
      WHERE j.tanggal >= CURDATE()
      ORDER BY f.judul
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE film baru
exports.createFilm = async (req, res) => {
  const { judul, genre, durasi, harga, sinopsis, rate_usia } = req.body;
  
  // Validasi
  if (!judul || !harga) {
    return res.status(400).json({ error: 'Judul dan harga wajib diisi' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO film (judul, genre, durasi, harga, sinopsis, rate_usia) VALUES (?, ?, ?, ?, ?, ?)',
      [judul, genre || null, durasi || null, harga, sinopsis || null, rate_usia || 0]
    );
    res.status(201).json({ 
      message: 'Film berhasil ditambahkan',
      id_film: result.insertId 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE film
exports.updateFilm = async (req, res) => {
  const { id } = req.params;
  const { judul, genre, durasi, harga, sinopsis, rate_usia } = req.body;
  
  if (!judul || !harga) {
    return res.status(400).json({ error: 'Judul dan harga wajib diisi' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE film SET judul = ?, genre = ?, durasi = ?, harga = ?, sinopsis = ?, rate_usia = ? WHERE id_film = ?',
      [judul, genre || null, durasi || null, harga, sinopsis || null, rate_usia || 0, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Film tidak ditemukan' });
    }
    
    res.json({ message: 'Film berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE film
exports.deleteFilm = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM film WHERE id_film = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Film tidak ditemukan' });
    }
    
    res.json({ message: 'Film berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};