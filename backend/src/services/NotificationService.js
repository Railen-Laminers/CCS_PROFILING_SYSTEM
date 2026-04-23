const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  /**
   * Create a new notification
   */
  static async create(data) {
    try {
      const notification = new Notification({
        recipient: data.recipient,
        type: data.type,
        title: data.title,
        message: data.message,
        relatedEntity: data.relatedEntity || {},
        actionUrl: data.actionUrl || null,
        metadata: data.metadata || new Map()
      });

      return await notification.save();
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  /**
   * Get all notifications for a user
   */
  static async getUserNotifications(userId, options = {}) {
    try {
      const { limit = 20, skip = 0, isRead = null } = options;
      
      const query = { recipient: userId };
      if (isRead !== null) {
        query.isRead = isRead;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      return notifications;
    } catch (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
  }

  /**
   * Get unread notification count for a user
   */
  static async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        recipient: userId,
        isRead: false
      });

      return count;
    } catch (error) {
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId) {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        throw new Error('Notification not found');
      }

      return notification;
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  /**
   * Mark multiple notifications as read
   */
  static async markMultipleAsRead(notificationIds) {
    try {
      const result = await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { isRead: true }
      );

      return result;
    } catch (error) {
      throw new Error(`Failed to mark notifications as read: ${error.message}`);
    }
  }

  /**
   * Mark all user notifications as read
   */
  static async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
      );

      return result;
    } catch (error) {
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
  }

  /**
   * Delete a notification
   */
  static async delete(notificationId) {
    try {
      const result = await Notification.findByIdAndDelete(notificationId);

      if (!result) {
        throw new Error('Notification not found');
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  /**
   * Delete all notifications for a user
   */
  static async deleteUserNotifications(userId) {
    try {
      const result = await Notification.deleteMany({ recipient: userId });
      return result;
    } catch (error) {
      throw new Error(`Failed to delete user notifications: ${error.message}`);
    }
  }

  /**
   * Notify event registration
   */
  static async notifyEventRegistration(userId, eventId, eventTitle) {
    try {
      return await this.create({
        recipient: userId,
        type: 'event_registration',
        title: 'Event Registration Confirmed',
        message: `You have successfully registered for "${eventTitle}"`,
        relatedEntity: {
          model: 'Event',
          id: eventId
        },
        actionUrl: `/admin/events/${eventId}`,
        metadata: new Map([['eventTitle', eventTitle]])
      });
    } catch (error) {
      throw new Error(`Failed to notify event registration: ${error.message}`);
    }
  }

  /**
   * Notify event invitation
   */
  static async notifyEventInvitation(userId, eventId, eventTitle) {
    try {
      return await this.create({
        recipient: userId,
        type: 'event_invitation',
        title: 'New Event Invitation',
        message: `You have been invited to participate in "${eventTitle}"`,
        relatedEntity: {
          model: 'Event',
          id: eventId
        },
        actionUrl: '/student/events',
        metadata: new Map([['eventTitle', eventTitle]])
      });
    } catch (error) {
      throw new Error(`Failed to notify event invitation: ${error.message}`);
    }
  }

  /**
   * Notify event unregistration
   */
  static async notifyEventUnregistration(userId, eventId, eventTitle) {
    try {
      return await this.create({
        recipient: userId,
        type: 'event_registration',
        title: 'Event Registration Cancelled',
        message: `You have unregistered from "${eventTitle}"`,
        relatedEntity: {
          model: 'Event',
          id: eventId
        },
        actionUrl: `/admin/events/${eventId}`,
        metadata: new Map([['eventTitle', eventTitle]])
      });
    } catch (error) {
      throw new Error(`Failed to notify event unregistration: ${error.message}`);
    }
  }

  /**
   * Notify event cancellation to all participants
   */
  static async notifyEventCancellation(participantIds, eventId, eventTitle) {
    try {
      const notifications = participantIds.map(userId => ({
        recipient: userId,
        type: 'event_cancellation',
        title: 'Event Cancelled',
        message: `The event "${eventTitle}" has been cancelled`,
        relatedEntity: {
          model: 'Event',
          id: eventId
        },
        actionUrl: '/admin/events',
        metadata: { eventTitle }
      }));

      return await Notification.insertMany(notifications);
    } catch (error) {
      throw new Error(`Failed to notify event cancellation: ${error.message}`);
    }
  }

  /**
   * Get all admin users
   */
  static async getAdminUsers() {
    try {
      const admins = await User.find({ role: 'admin' }).select('_id');
      return admins.map(admin => admin._id);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }
  }

  /**
   * Notify admins about new event creation
   */
  static async notifyEventCreated(eventId, eventTitle, eventDescription) {
    try {
      const adminIds = await this.getAdminUsers();
      
      const notifications = adminIds.map(adminId => ({
        recipient: adminId,
        type: 'event_creation',
        title: 'New Event Created',
        message: `A new event "${eventTitle}" has been created`,
        relatedEntity: {
          model: 'Event',
          id: eventId
        },
        actionUrl: `/admin/events/${eventId}`,
        metadata: { eventTitle, eventDescription }
      }));

      return await Notification.insertMany(notifications);
    } catch (error) {
      console.error('Failed to notify event creation:', error);
      // Don't throw to avoid breaking event creation
    }
  }

  /**
   * Notify admins about event update
   */
  static async notifyEventUpdated(eventId, eventTitle, participantIds) {
    try {
      // Notify admins
      const adminIds = await this.getAdminUsers();
      const recipientIds = [...new Set([...adminIds, ...participantIds])];
      
      const notifications = recipientIds.map(userId => ({
        recipient: userId,
        type: 'event_update',
        title: 'Event Updated',
        message: `The event "${eventTitle}" has been updated`,
        relatedEntity: {
          model: 'Event',
          id: eventId
        },
        actionUrl: `/admin/events/${eventId}`,
        metadata: { eventTitle }
      }));

      return await Notification.insertMany(notifications);
    } catch (error) {
      console.error('Failed to notify event update:', error);
    }
  }

  /**
   * Notify admins when student registers for event
   */
  static async notifyAdminStudentRegistered(studentId, eventId, eventTitle, studentName) {
    try {
      const adminIds = await this.getAdminUsers();
      
      const notifications = adminIds.map(adminId => ({
        recipient: adminId,
        type: 'event_registration',
        title: 'Student Registered for Event',
        message: `${studentName} has registered for "${eventTitle}"`,
        relatedEntity: {
          model: 'Event',
          id: eventId
        },
        actionUrl: `/admin/events/${eventId}`,
        metadata: { studentId, eventTitle, studentName }
      }));

      return await Notification.insertMany(notifications);
    } catch (error) {
      console.error('Failed to notify admin about registration:', error);
    }
  }

  /**
   * Notify admins when student unregisters from event
   */
  static async notifyAdminStudentUnregistered(studentId, eventId, eventTitle, studentName) {
    try {
      const adminIds = await this.getAdminUsers();
      
      const notifications = adminIds.map(adminId => ({
        recipient: adminId,
        type: 'event_registration',
        title: 'Student Unregistered from Event',
        message: `${studentName} has unregistered from "${eventTitle}"`,
        relatedEntity: {
          model: 'Event',
          id: eventId
        },
        actionUrl: `/admin/events/${eventId}`,
        metadata: { studentId, eventTitle, studentName }
      }));

      return await Notification.insertMany(notifications);
    } catch (error) {
      console.error('Failed to notify admin about unregistration:', error);
    }
  }

  /**
   * Notify users about new lesson plan
   */
  static async notifyLessonCreated(lessonId, lessonTitle, courseId, userIds) {
    try {
      const notifications = userIds.map(userId => ({
        recipient: userId,
        type: 'lesson_created',
        title: 'New Lesson Plan',
        message: `A new lesson "${lessonTitle}" has been created for your course`,
        relatedEntity: {
          model: 'LessonPlan',
          id: lessonId
        },
        actionUrl: `/admin/instruction/${courseId}`,
        metadata: { lessonTitle, courseId }
      }));

      return await Notification.insertMany(notifications);
    } catch (error) {
      console.error('Failed to notify lesson creation:', error);
    }
  }

  /**
   * Notify users about new class/schedule
   */
  static async notifyScheduleCreated(classId, className, userIds) {
    try {
      const notifications = userIds.map(userId => ({
        recipient: userId,
        type: 'schedule_created',
        title: 'New Schedule',
        message: `A new class schedule "${className}" has been created`,
        relatedEntity: {
          model: 'Class',
          id: classId
        },
        actionUrl: '/admin/scheduling',
        metadata: { className, classId }
      }));

      return await Notification.insertMany(notifications);
    } catch (error) {
      console.error('Failed to notify schedule creation:', error);
    }
  }
}

module.exports = NotificationService;
