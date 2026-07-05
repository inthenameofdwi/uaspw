const pool = require('../config/db');

// POST - Create new pemesanan
exports.createPemesanan = async (req, res) => {
  const { id_jadwal, nama, no_telepon, usia, nomor_kursi } = req.body;

  // Validasi dasar
  if (!id_jadwal || !nama || !nomor_kursi) {
    return res.status(400).json({ error: 'Data tidak lengkap. id_jadwal, nama, dan nomor_kursi wajib diisi.' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Cek apakah kursi sudah terpesan
    const [cekKursi] = await connection.query(
      'SELECT * FROM tiket WHERE id_jadwal = ? AND nomor_kursi = ?',
      [id_jadwal, nomor_kursi]
    );
    if (cekKursi.length > 0) {
      await connection.rollback();
      return res.status(409).json({ error: 'Kursi sudah dipesan oleh pengguna lain' });
    }

    // 2. Ambil informasi film dan jadwal untuk validasi usia
    const [jadwalInfo] = await connection.query(
      `SELECT f.id_film, f.judul, f.harga, f.rate_usia, 
              j.tanggal, j.jam 
       FROM jadwal j 
       JOIN film f ON j.id_film = f.id_film 
       WHERE j.id_jadwal = ?`,
      [id_jadwal]
    );
    
    if (jadwalInfo.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    }

    const filmData = jadwalInfo[0];

    // 3. Validasi usia pembeli
    // Jika rate_usia > 0 dan usia pembeli kurang dari rate_usia
    if (filmData.rate_usia > 0) {
      // Jika usia tidak diisi atau usia kurang dari batas
      if (!usia || parseInt(usia) < filmData.rate_usia) {
        await connection.rollback();
        return res.status(400).json({ 
          error: `Film ini hanya untuk usia ${filmData.rate_usia} tahun ke atas. Usia Anda ${usia || 'tidak diisi'}.`,
          rate_usia: filmData.rate_usia,
          usia_pembeli: usia || 0
        });
      }
    }

    // 4. Insert pembeli
    const [resultPembeli] = await connection.query(
      'INSERT INTO pembeli (nama, no_telepon, usia) VALUES (?, ?, ?)',
      [nama, no_telepon || null, usia || null]
    );
    const id_pembeli = resultPembeli.insertId;

    // 5. Insert pemesanan
    const total_harga = parseFloat(filmData.harga);
    const [resultPesan] = await connection.query(
      'INSERT INTO pemesanan (id_jadwal, id_pembeli, total_harga) VALUES (?, ?, ?)',
      [id_jadwal, id_pembeli, total_harga]
    );
    const id_pemesanan = resultPesan.insertId;

    // 6. Insert tiket
    await connection.query(
      'INSERT INTO tiket (id_pemesanan, id_jadwal, nomor_kursi) VALUES (?, ?, ?)',
      [id_pemesanan, id_jadwal, nomor_kursi]
    );

    await connection.commit();

    // Kirim response dengan data lengkap
    res.status(201).json({
      message: 'Pemesanan berhasil',
      id_pemesanan,
      total_harga,
      nama,
      nomor_kursi,
      id_jadwal
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error creating pemesanan:', err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// GET - Get pemesanan by ID
exports.getPemesananById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID pemesanan tidak valid' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT 
        p.id_pemesanan,
        p.total_harga,
        p.tanggal_pesan,
        pe.nama,
        pe.no_telepon,
        pe.usia,
        f.judul,
        f.genre,
        f.durasi,
        f.rate_usia,
        j.tanggal,
        j.jam,
        t.nomor_kursi
      FROM pemesanan p
      JOIN pembeli pe ON p.id_pembeli = pe.id_pembeli
      JOIN jadwal j ON p.id_jadwal = j.id_jadwal
      JOIN film f ON j.id_film = f.id_film
      JOIN tiket t ON p.id_pemesanan = t.id_pemesanan
      WHERE p.id_pemesanan = ?`,
      [parseInt(id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pemesanan tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error getting pemesanan:', err);
    res.status(500).json({ error: err.message });
  }
};