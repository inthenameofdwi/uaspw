const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getJadwalByFilm,
  createJadwal,
  updateJadwal,
  deleteJadwal
} = require('../controllers/jadwalController');

// Public route
router.get('/', getJadwalByFilm);

// Protected routes (admin only)
router.post('/', auth, createJadwal);
router.put('/:id', auth, updateJadwal);
router.delete('/:id', auth, deleteJadwal);

module.exports = router;