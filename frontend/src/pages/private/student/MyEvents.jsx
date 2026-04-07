import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { eventAPI } from '@/services/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa';

const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

export const MyEvents = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('registered');

    useEffect(() => {
        const fetchEvents = async () => {
            if (!user || user.role !== 'student') return;
            setLoading(true);
            try {
                const data = await eventAPI.getStudentEvents(user._id);
                setEvents(data || []);
            } catch (err) {
                console.error('Failed to fetch events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [user]);

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    const registeredEvents = events.filter(e => e.status === 'Completed' || e.status === 'Upcoming');
    const curricularEvents = events.filter(e => e.category === 'Curricular');
    const displayEvents = activeTab === 'registered' ? registeredEvents : curricularEvents;

    return (
        <div className="max-w-5xl">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                My Events
            </h1>

            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('registered')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors ${
                        activeTab === 'registered'
                            ? 'text-brand-500 border-b-2 border-brand-500'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    Registered Events
                </button>
                <button
                    onClick={() => setActiveTab('curricular')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors ${
                        activeTab === 'curricular'
                            ? 'text-brand-500 border-b-2 border-brand-500'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    Curricular Events
                </button>
            </div>

            {displayEvents.length === 0 ? (
                <div className="text-center py-12">
                    <FaCalendarAlt className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No events found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {displayEvents.map((event) => (
                        <div
                            key={event._id}
                            className="bg-white dark:bg-surface-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {event.description}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    event.status === 'Upcoming'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                    {event.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <FaClock className="w-4 h-4" />
                                    {formatDateTime(event.start_datetime)}
                                </div>
                                {event.venue && (
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="w-4 h-4" />
                                        {event.venue}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <FaUsers className="w-4 h-4" />
                                    {event.participants?.length || 0} registered
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEvents;