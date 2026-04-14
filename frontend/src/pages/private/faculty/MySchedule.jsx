import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { instructionAPI } from '@/services/api';
import { FiPlus, FiTrash2, FiClock, FiMapPin, FiBook } from 'react-icons/fi';

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

    const scheduleByDay = classes.reduce((acc, cls) => {
        const day = cls.schedule?.date || 'TBA';
        if (!acc[day]) acc[day] = [];
        acc[day].push(cls);
        return acc;
    }, {});

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleDelete = (index) => {
        console.log('Delete schedule:', index);
    };

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
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                        Schedule Management
                    </h1>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#ff6b00] hover:bg-orange-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25">
                        <FiPlus className="w-5 h-5" />
                        <span>+ Add Schedule</span>
                    </button>
                </div>

                {classes.length === 0 ? (
                    <div className={`text-center py-12 ${isDark ? 'bg-[#181818]' : 'bg-white'} rounded-xl border border-gray-200 dark:border-gray-800`}>
                        <FiClock className="mx-auto text-5xl text-gray-500 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500">No schedule available</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {days.map(day => {
                            const dayClasses = scheduleByDay[day] || [];
                            if (dayClasses.length === 0) return null;
                            
                            return (
                                <div key={day} className={`${isDark ? 'bg-[#181818]' : 'bg-white'} rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800`}>
                                    <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} px-5 py-3 border-b border-gray-200 dark:border-gray-800`}>
                                        <h2 className="font-semibold text-gray-800 dark:text-white">{day}</h2>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {dayClasses.map((cls, index) => (
                                            <div key={index} className={`p-4 ${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} rounded-xl border border-gray-200 dark:border-gray-800`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-gray-800 dark:text-white font-semibold text-lg">
                                                            {cls.course_id?.course_code || 'N/A'} - {cls.course_id?.course_name || 'Introduction to Programming'}
                                                        </h3>
                                                        <span className="px-2.5 py-1 text-xs font-medium text-[#ff6b00] bg-[#ff6b00]/15 rounded-full">
                                                            Approved
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleDelete(index)}
                                                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-2">
                                                        <FiClock className="w-4 h-4" />
                                                        {cls.schedule?.startTime || '09:00'} - {cls.schedule?.endTime || '11:00'}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <FiBook className="w-4 h-4" />
                                                        {cls.room_id?.name || 'Room 201'}
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