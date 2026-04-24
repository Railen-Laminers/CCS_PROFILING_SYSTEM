import React, { useState, useRef, useEffect } from 'react';
import { 
    FiBell, 
    FiX, 
    FiCheck, 
    FiTrash2, 
    FiCalendar, 
    FiUser, 
    FiAlertCircle, 
    FiInfo, 
    FiPlusCircle,
    FiSettings
} from 'react-icons/fi';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NotificationDropdown = ({ size = 'md' }) => {
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
        if (!notification.isRead) markAsRead(notification._id);
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

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notificationDate.toLocaleDateString();
    };

    const getNotificationConfig = (type) => {
        const configs = {
            event_registration: { icon: FiCheck, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
            event_creation: { icon: FiPlusCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            event_update: { icon: FiCalendar, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            event_cancellation: { icon: FiX, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
            event_reminder: { icon: FiBell, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-500/10' },
            system_alert: { icon: FiAlertCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-500/10' },
            user_action: { icon: FiUser, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
            default: { icon: FiInfo, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-500/10' }
        };
        return configs[type] || configs.default;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5",
                    size === 'sm' ? 'p-1.5' : 'p-2'
                )}
            >
                <FiBell className={size === 'sm' ? 'w-[18px] h-[18px]' : 'w-5 h-5'} />
                {unreadCount > 0 && (
                    <span className={cn(
                        "absolute bg-brand-500 rounded-full border-[1.5px] border-white dark:border-[#1E1E1E] shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse",
                        size === 'sm' ? 'top-1 right-1 w-[6px] h-[6px]' : 'top-1.5 right-1.5 w-2 h-2'
                    )} />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-[320px] bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="px-5 py-3.5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800/50">
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span className="bg-[#FF6B00] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={markAllAsRead}
                            className="text-[10px] font-bold text-[#FF6B00] hover:text-[#e66000] uppercase tracking-wider transition-colors disabled:opacity-30"
                            disabled={unreadCount === 0}
                        >
                            Mark all
                        </button>
                    </div>

                    {/* List */}
                    <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs font-medium text-gray-400">Syncing notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                                    <FiBell className="w-5 h-5 text-gray-300 dark:text-gray-700" />
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">All Caught Up!</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-500 max-w-[200px]">
                                    We'll notify you when something important happens.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-800/30">
                                {notifications.map((n) => {
                                    const config = getNotificationConfig(n.type);
                                    return (
                                            <div
                                                key={n._id}
                                                onClick={() => handleNotificationClick(n)}
                                                className={cn(
                                                    "group relative px-5 py-4 cursor-pointer transition-all duration-300 hover:bg-gray-50/80 dark:hover:bg-white/[0.02]",
                                                    !n.isRead && "bg-brand-50/30 dark:bg-brand-500/[0.03]"
                                                )}
                                            >
                                                {!n.isRead && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B00] shadow-[0_0_10px_rgba(255,107,0,0.4)]" />
                                                )}
                                                
                                                <div className="flex gap-4">
                                                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300", config.bg)}>
                                                        <config.icon className={cn("w-4.5 h-4.5", config.color)} />
                                                    </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate leading-tight">
                                                            {n.title}
                                                        </h4>
                                                        <span className="text-[9.5px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                                            {formatTime(n.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11.5px] text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                        {n.message}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(n._id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <FiTrash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                            <button
                                onClick={clearAllNotifications}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                            >
                                <FiTrash2 className="w-3 h-3" />
                                Clear All
                            </button>
                            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
                                {notifications.length} Items
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};