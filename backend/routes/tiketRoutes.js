const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getBookedSeats } = require('../controllers/tiketController');

// GET kursi yang sudah dipesan untuk jadwal tertentu
router.get('/booked/:jadwalId', auth, getBookedSeats);

module.exports = router;