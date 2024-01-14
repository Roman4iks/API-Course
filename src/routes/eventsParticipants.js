const express = require('express');
const eventsParticipantsController = require('../controllers/eventsParticipantsController');
const validateId = require('../middleware/validateId');
const { requireAuth, authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/participants', eventsParticipantsController.getAllParticipants);
router.get('/participants/:id', validateId, eventsParticipantsController.getParticipantById);
router.post('/participants', authenticateToken, requireAuth, eventsParticipantsController.createParticipant);
router.delete('/participants/:id', authenticateToken, requireAuth, validateId, eventsParticipantsController.deleteParticipant);
router.put('/participants/:id', authenticateToken, requireAuth, validateId, eventsParticipantsController.updateParticipant);

module.exports = router;