const express = require('express');
const membersController = require('../controllers/membersController')

const router = express.Router();

router.get('/members', membersController.getAllMembers)
router.get('/member/:id', membersController.getMember)
router.post('/member', membersController.createMember)

module.exports = router;