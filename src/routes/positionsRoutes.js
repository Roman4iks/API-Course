const express = require('express');
const positionsController = require('../controllers/positionsController');
const validateId = require('../middleware/validateId');
const { authenticateToken, requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/positions', positionsController.getAllPositions);
router.get('/positions/:id', validateId, positionsController.getPositionById);
router.post('/positions', authenticateToken, requireAuth, positionsController.createPosition);
router.delete('/positions/:id', authenticateToken, requireAuth, validateId, positionsController.deletePosition);
router.put('/positions/:id', authenticateToken, requireAuth, validateId, positionsController.updatePosition);

module.exports = router;
