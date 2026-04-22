import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { instructionAPI } from '@/services/api';
import { FiClock, FiBook, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';

export const MySchedule = () => {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Convert a date string (YYYY-MM-DD) to weekday name
    const getWeekdayFromDate = (dateString) => {
        if (!dateString) return null;
        // Check if it looks like a date (contains '-')
        if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('en-US', { weekday: 'long' });
            }
        }
        // If it's already a day name (e.g., "Monday"), capitalize and return
        return dateString.charAt(0).toUpperCase() + dateString.slice(1).toLowerCase();
    };

    // Get display day (the readable weekday)
    const getDisplayDay = (rawDate) => {
        const weekday = getWeekdayFromDate(rawDate);
        return weekday || 'TBA';
    };

    // Color mapping for badges
    const getDayColor = (rawDate) => {
        const weekday = getWeekdayFromDate(rawDate)?.toLowerCase();
        const colors = {
            monday: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
            tuesday: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
            wednesday: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
            thursday: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
            friday: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
            saturday: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
            sunday: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        };
        return colors[weekday] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    };

    useEffect(() => {
        const fetchClasses = async () => {
            if (!user || user.role !== 'faculty') return;
            setLoading(true);
            setError(null);
            try {
                const data = await instructionAPI.getClasses();
                setClasses(data || []);
            } catch (err) {
                console.error('Failed to fetch schedule:', err);
                setError(err.response?.data?.message || 'Failed to load schedule. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, [user]);

    if (loading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} p-6 lg:p-8`}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
                        <div className="w-12 h-12 rounded-full border-4 border-t-brand-500 border-r-brand-500 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} p-6 lg:p-8`}>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} p-6 lg:p-8`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            My Teaching Schedule
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Your assigned classes for the current term
                        </p>
                    </div>
                </div>

                {classes.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-gray-800">
                        <FiCalendar className="mx-auto text-5xl text-gray-400 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No classes assigned</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            You haven't been assigned any classes yet. Contact your administrator.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls) => {
                            const rawDate = cls.schedule?.date;
                            const displayDay = getDisplayDay(rawDate);
                            const dayColorClass = getDayColor(rawDate);

                            return (
                                <div
                                    key={cls._id}
                                    className="group bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 transition-all duration-300 hover:border-brand-500/50 hover:shadow-lg relative overflow-hidden"
                                >
                                    {/* Decorative corner accent */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>

                                    {/* Day badge and section */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center border border-brand-500/20">
                                                <FiBook className="w-5 h-5" />
                                            </div>
                                            {/* Day badge - now always visible */}
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dayColorClass}`}>
                                                {displayDay}
                                            </span>
                                        </div>
                                        <div className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 text-xs font-medium px-2.5 py-1 rounded-full">
                                            {cls.section || 'No section'}
                                        </div>
                                    </div>

                                    {/* Course title and code */}
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        {cls.course_id?.course_code || 'N/A'}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                        {cls.course_id?.course_title || 'Course title not available'}
                                    </p>

                                    {/* Schedule details */}
                                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <FiClock className="w-4 h-4 flex-shrink-0" />
                                            <span>
                                                {cls.schedule?.startTime || '??:??'} – {cls.schedule?.endTime || '??:??'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiMapPin className="w-4 h-4 flex-shrink-0" />
                                            <span>{cls.room_id?.name || 'Room not assigned'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiUsers className="w-4 h-4 flex-shrink-0" />
                                            <span>{cls.course_id?.units || '?'} units</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MySchedule;