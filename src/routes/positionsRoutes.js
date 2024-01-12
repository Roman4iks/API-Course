const express = require('express');
const positionsController = require('../controllers/positionsController');

const router = express.Router();

router.get('/positions', positionsController.getAllPositions);
router.get('/positions/:id', positionsController.getPositionById);
router.post('/positions', positionsController.createPosition);

module.exports = router;
