import React, { useState, useEffect } from 'react';
import { activityLogAPI } from '@/services/api';
import { FiRefreshCw, FiChevronLeft, FiChevronRight, FiInfo, FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const actionFilterOptions = [
    { label: 'All activities', value: '' },
    { label: 'Logins & Logouts', value: 'LOGIN|LOGOUT' },
    { label: 'Password changes', value: 'PASSWORD' },
    { label: 'Profile updates', value: 'UPDATE_PROFILE' },
    { label: 'User management', value: 'USER_' },
    { label: 'Event activities', value: 'EVENT_' },
    { label: 'Class & lesson activities', value: 'CLASS|LESSON|MATERIAL' },
    { label: 'Course activities', value: 'COURSE_' },
    { label: 'Room activities', value: 'ROOM_' },
    { label: 'Imports & Exports', value: 'IMPORT|EXPORT' },
];

// Consistent label styling from Profile page
const labelClasses = 'block text-[12px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1';

// Base input style without error states (for filters)
const filterInputClasses = 'w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 text-[14px]';

// Helper to parse friendly_message into header, separator, and change lines
const parseFriendlyMessage = (message) => {
    if (!message) return { headerLines: [], changeLines: [], hasChanges: false };
    
    const lines = message.split('\n');
    const oldNewIndex = lines.findIndex(line => line.trim() === 'Old → New');
    
    if (oldNewIndex === -1 || oldNewIndex === lines.length - 1) {
        // No "Old → New" line or nothing after it
        return { headerLines: lines, changeLines: [], hasChanges: false };
    }
    
    // Header includes everything from start to the line before "Old → New"
    const headerLines = lines.slice(0, oldNewIndex + 1); // include "Old → New" line as part of always-visible content
    const changeLines = lines.slice(oldNewIndex + 1);
    
    return {
        headerLines,
        changeLines: changeLines.filter(line => line.trim().length > 0),
        hasChanges: changeLines.length > 0
    };
};

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLogId, setExpandedLogId] = useState(null);      // For raw metadata (FiInfo)
    const [expandedChangesId, setExpandedChangesId] = useState(null); // For collapsible field changes
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    // Filter state
    const [filters, setFilters] = useState({
        actionPattern: '',
        startDate: '',
        endDate: '',
    });
    const [selectedActionLabel, setSelectedActionLabel] = useState('All activities');

    // State for available date range
    const [dateRange, setDateRange] = useState({ from: null, to: null });

    // Fetch the available date range once on mount
    useEffect(() => {
        const fetchDateRange = async () => {
            try {
                const range = await activityLogAPI.getMyDateRange();
                setDateRange(range);
            } catch (error) {
                console.error('Failed to fetch date range:', error);
            }
        };
        fetchDateRange();
    }, []);

    const fetchLogs = async (page = 1, appliedPattern = filters.actionPattern, startDate = filters.startDate, endDate = filters.endDate) => {
        setLoading(true);
        try {
            const data = await activityLogAPI.getMyLogs({
                page,
                limit: pagination.limit,
                action: appliedPattern,
                startDate,
                endDate,
            });
            setLogs(data.logs);
            setPagination(data.pagination);
            if (data.availableDateRange) {
                setDateRange(data.availableDateRange);
            }
        } catch (error) {
            console.error('Failed to fetch activity logs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchLogs(1, '', '', '');
    }, []);

    const handleActionChange = (e) => {
        const selectedValue = e.target.value;
        const selectedOption = actionFilterOptions.find(opt => opt.value === selectedValue);
        setSelectedActionLabel(selectedOption ? selectedOption.label : 'All activities');
        setFilters(prev => ({ ...prev, actionPattern: selectedValue }));
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        fetchLogs(1, filters.actionPattern, filters.startDate, filters.endDate);
        setExpandedLogId(null);
        setExpandedChangesId(null);
    };

    const handleReset = () => {
        setFilters({ actionPattern: '', startDate: '', endDate: '' });
        setSelectedActionLabel('All activities');
        fetchLogs(1, '', '', '');
        setExpandedLogId(null);
        setExpandedChangesId(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        fetchLogs(newPage, filters.actionPattern, filters.startDate, filters.endDate);
        setExpandedLogId(null);
        setExpandedChangesId(null);
    };

    const toggleMetadata = (logId) => {
        setExpandedLogId(expandedLogId === logId ? null : logId);
    };

    const toggleFieldChanges = (logId) => {
        setExpandedChangesId(expandedChangesId === logId ? null : logId);
    };

    // Helper: convert date object to YYYY-MM-DD for input min/max attributes
    const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    const minDate = dateRange.from ? formatDateForInput(dateRange.from) : '';
    const maxDate = dateRange.to ? formatDateForInput(dateRange.to) : '';

    return (
        <div className="w-full space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                    My Activity Logs
                </h1>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchLogs(pagination.page, filters.actionPattern, filters.startDate, filters.endDate)}
                    className="rounded-xl h-10 w-10 p-0"
                    title="Refresh"
                >
                    <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* Filter Card */}
            <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
                    <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                        <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/20">
                            <FiSearch className="w-5 h-5 text-brand-500" />
                        </div>
                        Filter Activity Logs
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                            <label className={labelClasses}>Activity type</label>
                            <select
                                value={filters.actionPattern}
                                onChange={handleActionChange}
                                className={filterInputClasses}
                            >
                                {actionFilterOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className={labelClasses}>From date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleDateChange}
                                min={minDate}
                                max={maxDate}
                                className={filterInputClasses}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClasses}>To date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleDateChange}
                                min={minDate}
                                max={maxDate}
                                className={filterInputClasses}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            className="gap-2 rounded-xl h-10 px-4 text-[13px] border-gray-200 dark:border-gray-800"
                        >
                            <FiX className="w-4 h-4" /> Clear filters
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSearch}
                            className="gap-2 rounded-xl h-10 px-5 bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                        >
                            <FiSearch className="w-4 h-4" /> Show logs
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Logs List */}
            {loading && logs.length === 0 ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-400">No activity logs found for the selected filters.</p>
                    <p className="text-sm text-gray-400 mt-1">Try changing the activity type or date range.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {logs.map((log) => {
                        const { headerLines, changeLines, hasChanges } = parseFriendlyMessage(log.friendly_message);
                        const isChangesExpanded = expandedChangesId === log._id;
                        const timestamp = new Date(log.createdAt).toLocaleString();

                        return (
                            <Card
                                key={log._id}
                                className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md"
                            >
                                <CardContent className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                        <div className="flex-1">
                                            {!hasChanges ? (
                                                // No changes to collapse – show full message as before
                                                <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-line leading-relaxed">
                                                    {log.friendly_message}
                                                </p>
                                            ) : (
                                                <>
                                                    {/* Always visible: header lines (including "Old → New") */}
                                                    <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                                                        {headerLines.map((line, idx) => (
                                                            <div key={idx} className={idx === headerLines.length - 1 ? 'font-medium text-gray-700 dark:text-gray-300 mt-1' : ''}>
                                                                {line}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    {/* Collapsible button + change lines */}
                                                    <div className="mt-3">
                                                        <button
                                                            onClick={() => toggleFieldChanges(log._id)}
                                                            className="flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors focus:outline-none"
                                                        >
                                                            {isChangesExpanded ? (
                                                                <>
                                                                    <FiChevronUp className="w-4 h-4" />
                                                                    <span>Hide field changes</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiChevronDown className="w-4 h-4" />
                                                                    <span>Show {changeLines.length} field {changeLines.length === 1 ? 'change' : 'changes'}</span>
                                                                </>
                                                            )}
                                                        </button>
                                                        
                                                        {isChangesExpanded && (
                                                            <div className="mt-3 space-y-1.5 pl-2 border-l-2 border-brand-200 dark:border-brand-800">
                                                                {changeLines.map((line, idx) => (
                                                                    <pre key={idx} className="text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap break-words">
                                                                        {line}
                                                                    </pre>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                            <span>{timestamp}</span>
                                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                                                <button
                                                    onClick={() => toggleMetadata(log._id)}
                                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                    title="View raw metadata"
                                                >
                                                    <FiInfo className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Raw metadata expansion (FiInfo) */}
                                    {expandedLogId === log._id && log.metadata && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                                Raw metadata
                                            </p>
                                            <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto text-gray-600 dark:text-gray-300 font-mono">
                                                {JSON.stringify(log.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="rounded-xl h-10 w-10 p-0 border-gray-200 dark:border-gray-800 disabled:opacity-50"
                    >
                        <FiChevronLeft className="w-5 h-5" />
                    </Button>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="rounded-xl h-10 w-10 p-0 border-gray-200 dark:border-gray-800 disabled:opacity-50"
                    >
                        <FiChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ActivityLogs;