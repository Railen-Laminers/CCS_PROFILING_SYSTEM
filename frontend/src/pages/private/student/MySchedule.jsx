import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaClock, FaBook, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

export const MySchedule = () => {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!user || user.role !== 'student') return;
            setLoading(true);
            try {
                const scheduleData = user.student?.current_subjects || [];
                setSchedule(scheduleData.map(subject => ({
                    subject,
                    time: 'TBA',
                    room: 'TBA',
                    instructor: 'TBA'
                })));
            } catch (err) {
                console.error('Failed to fetch schedule:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [user]);

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="max-w-5xl">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                My Schedule
            </h1>

            <div className="bg-white dark:bg-surface-secondary border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                    Day
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                    Subject
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                    Time
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                    Room
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                    Instructor
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No schedule available
                                    </td>
                                </tr>
                            ) : (
                                schedule.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                                        <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                                            {days[index] || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                                            <div className="flex items-center gap-2">
                                                <FaBook className="w-4 h-4 text-brand-500" />
                                                {item.subject}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <FaClock className="w-4 h-4" />
                                                {item.time}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="w-4 h-4" />
                                                {item.room}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <FaUser className="w-4 h-4" />
                                                {item.instructor}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MySchedule;