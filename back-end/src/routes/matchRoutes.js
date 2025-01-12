const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchController');

router.get('/', getMatches);

module.exports = router;