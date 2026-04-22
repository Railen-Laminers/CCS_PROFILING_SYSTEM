import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { instructionAPI } from '@/services/api';
import { FiClock, FiBook, FiMapPin } from 'react-icons/fi';

export const MySchedule = () => {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            if (!user || user.role !== 'faculty') return;
            setLoading(true);
            try {
                // No need to pass instructor_id – backend uses logged‑in user
                const data = await instructionAPI.getClasses();
                setClasses(data || []);
            } catch (err) {
                console.error('Failed to fetch schedule:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, [user]);

    // Group classes by day (schedule.date stores day name)
    const scheduleByDay = classes.reduce((acc, cls) => {
        const day = cls.schedule?.date || 'TBA';
        if (!acc[day]) acc[day] = [];
        acc[day].push(cls);
        return acc;
    }, {});

    // Sort classes within each day by start time
    const sortByTime = (a, b) => {
        const timeA = a.schedule?.startTime || '00:00';
        const timeB = b.schedule?.startTime || '00:00';
        return timeA.localeCompare(timeB);
    };

    // Desired order of weekdays
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedDays = Object.keys(scheduleByDay).sort(
        (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
    );

    if (loading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} p-6 lg:p-8`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                    <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} p-6 lg:p-8`}>
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-8">
                    My Teaching Schedule
                </h1>

                {classes.length === 0 ? (
                    <div className={`text-center py-12 ${isDark ? 'bg-[#181818]' : 'bg-white'} rounded-xl border border-gray-200 dark:border-gray-800`}>
                        <FiClock className="mx-auto text-5xl text-gray-500 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500">No classes assigned yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedDays.map(day => {
                            const dayClasses = scheduleByDay[day];
                            if (!dayClasses.length) return null;
                            const sorted = [...dayClasses].sort(sortByTime);
                            return (
                                <div key={day} className={`${isDark ? 'bg-[#181818]' : 'bg-white'} rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800`}>
                                    <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} px-5 py-3 border-b border-gray-200 dark:border-gray-800`}>
                                        <h2 className="font-semibold text-gray-800 dark:text-white">{day}</h2>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {sorted.map((cls, idx) => (
                                            <div key={idx} className={`p-4 ${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} rounded-xl border border-gray-200 dark:border-gray-800`}>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                                    <h3 className="text-gray-800 dark:text-white font-semibold text-lg">
                                                        {cls.course_id?.course_code || 'N/A'} – {cls.course_id?.course_title || 'Course'}
                                                    </h3>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        Section: {cls.section || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-400 text-sm">
                                                    <span className="flex items-center gap-2">
                                                        <FiClock className="w-4 h-4" />
                                                        {cls.schedule?.startTime || '??:??'} – {cls.schedule?.endTime || '??:??'}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <FiMapPin className="w-4 h-4" />
                                                        {cls.room_id?.name || 'Room not assigned'}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <FiBook className="w-4 h-4" />
                                                        {cls.course_id?.units || '?'} units
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
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