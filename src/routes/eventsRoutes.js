const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/eventsController');
const { requireAuth, authenticateToken } = require('../middleware/authMiddleware');
const validateId = require('../middleware/validateId');

router.get('/events', eventsController.getAllEvents);
router.get('/events/:id', validateId, eventsController.getEventById);
router.post('/events', authenticateToken, requireAuth, eventsController.createEvent);
router.put('/events/:id', authenticateToken, requireAuth, validateId, eventsController.updateEvent);
router.delete('/events/:id', authenticateToken, requireAuth, validateId, eventsController.deleteEvent);

module.exports = router;