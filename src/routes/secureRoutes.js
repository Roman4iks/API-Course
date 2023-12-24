const express = require('express');
const secureController = require('../controllers/secureController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/secure-data', authenticateToken, secureController.getSecureData);

module.exports = router;
