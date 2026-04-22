import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiX, FiCheck, FiTrash2 } from 'react-icons/fi'; // Removed FiCheckDouble
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications
    } = useNotifications();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }

        if (notification.actionUrl) {
            navigate(notification.actionUrl);
            setIsOpen(false);
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffMs = now - notificationDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notificationDate.toLocaleDateString();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'event_registration':
                return '📝';
            case 'event_creation':
                return '✨';
            case 'event_update':
                return '📋';
            case 'event_cancellation':
                return '❌';
            case 'event_reminder':
                return '🔔';
            case 'lesson_created':
                return '📚';
            case 'schedule_created':
                return '📅';
            case 'system_alert':
                return '⚠️';
            case 'user_action':
                return '👤';
            default:
                return '📢';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gray-500 dark:text-zinc-400 hover:text-brand-500 dark:hover:text-brand-400 rounded-xl transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Notifications"
                title="Notifications"
            >
                <FiBell className="w-5 h-5 stroke-[2]" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block w-[6px] h-[6px] bg-brand-500 rounded-full border-[1.5px] border-white dark:border-surface-dark shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse"></span>
                )}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-surface-secondary shadow-xl border border-gray-100 dark:border-border-dark rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-border-dark bg-gray-50/50 dark:bg-surface-dark/50">
                        <div className="flex items-center gap-2">
                            <FiBell className="w-5 h-5 text-brand-500" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span className="text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full font-medium">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <FiBell className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    No notifications yet
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-border-dark">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`px-4 py-3 cursor-pointer transition-colors ${notification.isRead
                                                ? 'bg-white dark:bg-surface-secondary hover:bg-gray-50 dark:hover:bg-surface-dark'
                                                : 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl mt-1 flex-shrink-0">
                                                {getNotificationIcon(notification.type)}
                                            </span>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.isRead && (
                                                        <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1" />
                                                    )}
                                                </div>

                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>

                                                <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">
                                                    {formatTime(notification.createdAt)}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification._id);
                                                }}
                                                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0 mt-1"
                                                title="Delete notification"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {notifications.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-border-dark bg-gray-50/50 dark:bg-surface-dark/50">
                            {unreadCount > 0 ? (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                                >
                                    <FiCheck className="w-4 h-4" /> {/* Replaced FiCheckDouble */}
                                    Mark all as read
                                </button>
                            ) : (
                                <span className="text-xs text-gray-500 dark:text-gray-400">All caught up!</span>
                            )}

                            <button
                                onClick={clearAllNotifications}
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FiTrash2 className="w-4 h-4" />
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};