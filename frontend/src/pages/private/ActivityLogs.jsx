import React, { useState, useEffect } from 'react';
import { activityLogAPI } from '@/services/api';
import { FiRefreshCw, FiChevronLeft, FiChevronRight, FiInfo } from 'react-icons/fi';

const actionLabels = {
    // Auth actions
    LOGIN_SUCCESS: 'Login Success',
    LOGIN_FAILED: 'Login Failed',
    LOGOUT: 'Logout',
    FORGOT_PASSWORD_REQUEST: 'Forgot Password Request',
    PASSWORD_RESET_SUCCESS: 'Password Reset Success',
    PASSWORD_RESET_FAILED: 'Password Reset Failed',
    UPDATE_PROFILE: 'Profile Update',

    // User management actions (create, update, delete, import, export)
    USER_CREATED: 'User Created',
    USER_UPDATED: 'User Updated',
    USER_DELETED: 'User Deleted',
    STUDENTS_IMPORTED: 'Students Imported',
    STUDENTS_EXPORTED: 'Students Exported',
};

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLogId, setExpandedLogId] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            const data = await activityLogAPI.getMyLogs(page, pagination.limit);
            setLogs(data.logs);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Failed to fetch activity logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(1);
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        fetchLogs(newPage);
        setExpandedLogId(null);
    };

    const toggleMetadata = (logId) => {
        setExpandedLogId(expandedLogId === logId ? null : logId);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Activity Logs</h1>
                <button
                    onClick={() => fetchLogs(pagination.page)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Refresh"
                >
                    <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {loading && logs.length === 0 ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-400">No activity logs found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {logs.map((log) => (
                        <div
                            key={log._id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
                        >
                            <div className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                    <div className="flex-1">
                                        {/* ✅ Use whitespace-pre-line to render line breaks and bullets */}
                                        <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-line">
                                            {log.friendly_message}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                                            <button
                                                onClick={() => toggleMetadata(log._id)}
                                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                title="View details"
                                            >
                                                <FiInfo className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {expandedLogId === log._id && log.metadata && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto text-gray-600 dark:text-gray-300">
                                            {JSON.stringify(log.metadata, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityLogs;