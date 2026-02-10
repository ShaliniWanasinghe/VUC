const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// All notice routes require authentication
router.use(authMiddleware);

// Get all notices (filtered by role internally)
router.get('/', noticeController.getNotices);

// Get single notice by ID
router.get('/:id', noticeController.getNoticeById);

// Create notice (Admin or Moderator)
router.post('/', roleMiddleware(['admin', 'moderator']), noticeController.createNotice);

// Update notice (Admin or Author)
router.put('/:id', roleMiddleware(['admin', 'moderator']), noticeController.updateNotice);

// Update notice status (Admin only)
router.patch('/:id/status', roleMiddleware(['admin']), noticeController.updateNoticeStatus);

// Delete notice (Admin or Author)
router.delete('/:id', roleMiddleware(['admin', 'moderator']), noticeController.deleteNotice);

// User interactions
router.post('/:id/interest', noticeController.toggleInterest);
router.post('/:id/remind', noticeController.toggleReminder);

module.exports = router;
