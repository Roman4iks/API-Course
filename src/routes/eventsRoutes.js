const express = require('express');

const eventsController = require('../controllers/eventsController');

const { requireAuth, authenticateToken } = require('../middleware/authMiddleware');

const validateEventId = require('../middleware/validateEventId');

const router = express.Router();

router.get('/events', eventsController.getAllEvents);

router.get('/events/:id', validateEventId, eventsController.getEventById);

router.post('/events', authenticateToken, requireAuth, eventsController.createEvent);

router.put('/events/:id', authenticateToken, requireAuth, validateEventId, eventsController.updateEvent);

router.delete('/events/:id', authenticateToken, requireAuth, validateEventId, eventsController.deleteEvent);

module.exports = router;