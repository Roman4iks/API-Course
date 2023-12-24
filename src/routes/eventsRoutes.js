const express = require('express');
const eventsController = require('../controllers/eventsController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Вспомогательная функция для валидации целых чисел
function validateIntegerParam(param) {
  const intValue = parseInt(param, 10);
  return !isNaN(intValue) ? intValue : null;
}

router.get('/events', eventsController.getAllEvents);

router.get('/events/:id', (req, res, next) => {
  const eventId = validateIntegerParam(req.params.id);

  if (eventId === null) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  req.params.id = eventId;
  next();
}, eventsController.getEventById);

router.post('/events', requireAuth, eventsController.createEvent);

router.put('/events/:id', requireAuth, (req, res, next) => {
  const eventId = validateIntegerParam(req.params.id);

  if (eventId === null) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  req.params.id = eventId;
  next();
}, eventsController.updateEvent);

router.delete('/events/:id', requireAuth, (req, res, next) => {
  const eventId = validateIntegerParam(req.params.id);

  if (eventId === null) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  req.params.id = eventId;
  next();
}, eventsController.deleteEvent);

module.exports = router;

