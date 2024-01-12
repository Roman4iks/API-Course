const express = require('express');
const eventsParticipantsController = require('../controllers/eventsParticipantsController');

const router = express.Router();

router.get('/participants', eventsParticipantsController.getAllParticipants);
router.get('/participants/:id', eventsParticipantsController.getParticipantById);
router.post('/participants', eventsParticipantsController.createParticipant);

module.exports = router;