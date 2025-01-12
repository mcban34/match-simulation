const express = require('express');
const router = express.Router();
const { getTopScorers } = require('../controllers/scorerController');

router.get('/', getTopScorers);

module.exports = router;
