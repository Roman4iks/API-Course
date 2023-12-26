const express = require('express');
const router = express.Router();

const partiesController = require('../controllers/partiesController');
const {requireAuth, authenticateToken} = require('../middleware/authMiddleware');
const validateId = require('../middleware/validateId');

router.get('/parties', partiesController.getAllParties);
router.get('/party/:id', validateId, partiesController.getPartyById);
router.post('/party', authenticateToken, requireAuth, partiesController.createParty);
router.put('/party/:id', authenticateToken, requireAuth, validateId, partiesController.updateParty);
router.delete('/party/:id', authenticateToken, requireAuth, validateId, partiesController.deleteParty);

module.exports = router;
