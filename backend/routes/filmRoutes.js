const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllFilms, getFilmById, getFilmsWithSchedule } = require('../controllers/filmController');

router.get('/', getAllFilms);
router.get('/with-schedule', getFilmsWithSchedule);  // ← Pastikan ini ada dan benar
router.get('/:id', getFilmById);


const { 
  createFilm,
  updateFilm,
  deleteFilm
} = require('../controllers/filmController');

// Public routes (bisa diakses tanpa login)
router.get('/', getAllFilms);
router.get('/with-schedule', getFilmsWithSchedule);
router.get('/:id', getFilmById);

// Protected routes (hanya admin yang bisa CRUD)
router.post('/', auth, createFilm);
router.put('/:id', auth, updateFilm);
router.delete('/:id', auth, deleteFilm);

module.exports = router;
module.exports = router;