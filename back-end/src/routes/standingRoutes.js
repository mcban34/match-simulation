const express = require('express');
const router = express.Router();
const { getStandings } = require('../controllers/standingController');

router.get('/', getStandings);

module.exports = router;