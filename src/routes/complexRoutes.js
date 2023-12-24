const express = require('express');
const complexController = require('../controllers/complexController');

const router = express.Router();

router.get('/events/:id/members', complexController.getMembersOfEvent);
router.get('/members/:id/events', complexController.getEventsOfMember);

module.exports = router;
