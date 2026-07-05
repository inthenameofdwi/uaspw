const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPemesanan, getPemesananById } = require('../controllers/pemesananController');

// Route untuk membuat pemesanan baru
router.post('/', auth, createPemesanan);

// Route untuk mendapatkan detail pemesanan berdasarkan ID
router.get('/:id', auth, getPemesananById);

module.exports = router;