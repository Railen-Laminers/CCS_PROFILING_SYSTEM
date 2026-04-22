const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const { protect } = require('../middleware/auth');   // ← import protect

const router = express.Router();

// Require authentication for all notification routes
router.use(protect);   // ← use protect

/**
 * Get all notifications for the authenticated user
 * GET /api/notifications
 */
router.get('/', NotificationController.index);

/**
 * Get unread notification count
 * GET /api/notifications/unread/count
 */
router.get('/unread/count', NotificationController.getUnreadCount);

/**
 * Get unread notifications
 * GET /api/notifications/unread
 */
router.get('/unread', NotificationController.getUnread);

/**
 * Mark a notification as read
 * PATCH /api/notifications/:id/read
 */
router.patch('/:id/read', NotificationController.markAsRead);

/**
 * Mark multiple notifications as read
 * PATCH /api/notifications/read/multiple
 */
router.patch('/read/multiple', NotificationController.markMultipleAsRead);

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read/all
 */
router.patch('/read/all', NotificationController.markAllAsRead);

/**
 * Delete a notification
 * DELETE /api/notifications/:id
 */
router.delete('/:id', NotificationController.destroy);

/**
 * Clear all notifications
 * DELETE /api/notifications
 */
router.delete('/clear/all', NotificationController.clearAll);

module.exports = router;