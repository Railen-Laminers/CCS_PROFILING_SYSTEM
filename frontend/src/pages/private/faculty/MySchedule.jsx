import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { instructionAPI } from '@/services/api';
import { FaClock, FaBook, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

export const MySchedule = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            if (!user || user.role !== 'faculty') return;
            setLoading(true);
            try {
                const data = await instructionAPI.getClasses({ instructor_id: user.faculty?._id });
                setClasses(data || []);
            } catch (err) {
                console.error('Failed to fetch schedule:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
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

    const scheduleByDay = classes.reduce((acc, cls) => {
        const day = cls.schedule?.date || 'TBA';
        if (!acc[day]) acc[day] = [];
        acc[day].push(cls);
        return acc;
    }, {});

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="max-w-5xl">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                My Schedule
            </h1>

            {classes.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-surface-secondary border border-gray-200 dark:border-gray-700 rounded-xl">
                    <FaClock className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No schedule available</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {days.map(day => {
                        const dayClasses = scheduleByDay[day] || [];
                        if (dayClasses.length === 0) return null;
                        
                        return (
                            <div key={day} className="bg-white dark:bg-surface-secondary border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-gray-50 dark:bg-surface-dark px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="font-semibold text-gray-800 dark:text-gray-200">{day}</h2>
                                </div>
                                <div className="p-5 space-y-3">
                                    {dayClasses.map((cls, index) => (
                                        <div key={index} className="flex flex-wrap gap-4 p-3 bg-gray-50 dark:bg-surface-dark rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <FaBook className="w-4 h-4 text-brand-500" />
                                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                                    {cls.course_id?.course_code || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <FaClock className="w-4 h-4" />
                                                <span>{cls.schedule?.startTime}-{cls.schedule?.endTime}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <FaMapMarkerAlt className="w-4 h-4" />
                                                <span>{cls.room_id?.name || 'TBA'}</span>
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
    );
};

export default MySchedule;