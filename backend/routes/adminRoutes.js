const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllPembeli } = require('../controllers/pembeliController');
const { createJadwal, updateJadwal, deleteJadwal } = require('../controllers/jadwalController');
const { getStats } = require('../controllers/dashboardController');

router.use(auth); // semua route di bawah butuh login

router.get('/pembeli', getAllPembeli);
router.post('/jadwal', createJadwal);
router.put('/jadwal/:id', updateJadwal);
router.delete('/jadwal/:id', deleteJadwal);
router.get('/dashboard/stats', getStats);

module.exports = router;