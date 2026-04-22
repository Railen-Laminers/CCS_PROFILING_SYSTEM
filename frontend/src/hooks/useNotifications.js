import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../services/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all notifications for the current user
   */
  const fetchNotifications = useCallback(async (limit = 20, skip = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/notifications', {
        params: { limit, skip }
      });
      
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch only unread notifications
   */
  const fetchUnreadNotifications = useCallback(async (limit = 10, skip = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/notifications/unread', {
        params: { limit, skip }
      });
      
      return response.data.notifications || [];
    } catch (err) {
      setError(err.message || 'Failed to fetch unread notifications');
      console.error('Error fetching unread notifications:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get unread notification count
   */
  const getUnreadCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/notifications/unread/count');
      setUnreadCount(response.data.unreadCount || 0);
      return response.data.unreadCount;
    } catch (err) {
      console.error('Error getting unread count:', err);
      return 0;
    }
  }, []);

  /**
   * Mark a single notification as read
   */
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  /**
   * Mark multiple notifications as read
   */
  const markMultipleAsRead = useCallback(async (notificationIds) => {
    try {
      await axiosInstance.patch('/notifications/read/multiple', {
        notificationIds
      });
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notificationIds.includes(notif._id) ? { ...notif, isRead: true } : notif
        )
      );
      
      // Recalculate unread count
      const unreadNotifications = notifications.filter(
        notif => notificationIds.includes(notif._id) && !notif.isRead
      );
      setUnreadCount(prev => Math.max(0, prev - unreadNotifications.length));
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  }, [notifications]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await axiosInstance.patch('/notifications/read/all');
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  /**
   * Delete a notification
   */
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);
      
      // Update local state
      const deletedNotif = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      
      // Update unread count if the deleted notification was unread
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(async () => {
    try {
      await axiosInstance.delete('/notifications/clear/all');
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling interval to check for new notifications
    const interval = setInterval(() => {
      getUnreadCount();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markMultipleAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };
};
