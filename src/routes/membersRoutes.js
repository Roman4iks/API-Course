const express = require('express');
const router = express.Router();

const membersController = require('../controllers/membersController');
const { requireAuth, authenticateToken,  } = require('../middleware/authMiddleware');
const validateId = require('../middleware/validateId');

router.get('/members', membersController.getAllMembers);
router.get('/member/:id', validateId, membersController.getMemberById);
router.post('/member', authenticateToken, requireAuth, membersController.createMember);
router.put('/member/:id', authenticateToken, requireAuth, validateId, membersController.updateMember);
router.delete('/member/:id', authenticateToken, requireAuth, validateId, membersController.deleteMember);

module.exports = router;