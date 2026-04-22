const NotificationService = require('../services/NotificationService');

class NotificationController {
  /**
   * Get all notifications for the authenticated user
   */
  static async index(req, res, next) {
    try {
      const userId = req.user._id;
      const { limit = 20, skip = 0 } = req.query;

      const notifications = await NotificationService.getUserNotifications(userId, {
        limit: parseInt(limit),
        skip: parseInt(skip)
      });

      const unreadCount = await NotificationService.getUnreadCount(userId);

      res.status(200).json({
        notifications,
        unreadCount,
        count: notifications.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(req, res, next) {
    try {
      const userId = req.user._id;
      const unreadCount = await NotificationService.getUnreadCount(userId);

      res.status(200).json({
        unreadCount
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get unread notifications only
   */
  static async getUnread(req, res, next) {
    try {
      const userId = req.user._id;
      const { limit = 10, skip = 0 } = req.query;

      const notifications = await NotificationService.getUserNotifications(userId, {
        limit: parseInt(limit),
        skip: parseInt(skip),
        isRead: false
      });

      res.status(200).json({
        notifications,
        count: notifications.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark a single notification as read
   */
  static async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const notification = await NotificationService.markAsRead(id);

      res.status(200).json({
        message: 'Notification marked as read',
        notification
      });
    } catch (error) {
      if (error.message === 'Notification not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Mark multiple notifications as read
   */
  static async markMultipleAsRead(req, res, next) {
    try {
      const { notificationIds } = req.body;

      if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        return res.status(400).json({ message: 'Invalid notification IDs' });
      }

      const result = await NotificationService.markMultipleAsRead(notificationIds);

      res.status(200).json({
        message: 'Notifications marked as read',
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark all user notifications as read
   */
  static async markAllAsRead(req, res, next) {
    try {
      const userId = req.user._id;
      const result = await NotificationService.markAllAsRead(userId);

      res.status(200).json({
        message: 'All notifications marked as read',
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a notification
   */
  static async destroy(req, res, next) {
    try {
      const { id } = req.params;
      await NotificationService.delete(id);

      res.status(200).json({
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Notification not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Clear all notifications
   */
  static async clearAll(req, res, next) {
    try {
      const userId = req.user._id;
      const result = await NotificationService.deleteUserNotifications(userId);

      res.status(200).json({
        message: 'All notifications cleared',
        deletedCount: result.deletedCount
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NotificationController;
