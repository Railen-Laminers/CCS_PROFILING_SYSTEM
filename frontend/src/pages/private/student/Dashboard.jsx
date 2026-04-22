import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { eventAPI } from '@/services/api';
import { FiUser, FiBook, FiHeart, FiAward, FiUsers, FiAlertTriangle, FiCalendar, FiCheckCircle, FiInfo } from 'react-icons/fi';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || user.role !== 'student') return;
      try {
        // Fetch all events (for upcoming events)
        const allEvents = await eventAPI.getEvents();
        // Filter upcoming events (status 'Upcoming' and start_datetime > now)
        const now = new Date();
        const upcoming = allEvents
          .filter(e => e.status === 'Upcoming' && new Date(e.start_datetime) > now)
          .slice(0, 3);
        setUpcomingEvents(upcoming);

        // Fetch student's registered events to get count
        const registered = await eventAPI.getStudentEvents(user.id);
        setRegisteredCount(registered.length);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  // Profile sections (each links to its route)
  const profileSections = [
    { title: 'Personal Information', icon: FiUser, path: '/student/my-details', status: user?.student ? 'completed' : 'not completed' },
    { title: 'Academic', icon: FiBook, path: '/student/academic', status: user?.student?.program ? 'completed' : 'not completed' },
    { title: 'Medical', icon: FiHeart, path: '/student/medical', status: user?.student?.blood_type ? 'completed' : 'not completed' },
    { title: 'Sports & Activities', icon: FiAward, path: '/student/sports', status: user?.student?.sports_activities ? 'completed' : 'not completed' },
    { title: 'Organizations', icon: FiUsers, path: '/student/organizations', status: user?.student?.organizations ? 'completed' : 'not completed' },
    { title: 'Behavior Records', icon: FiAlertTriangle, path: '/student/behavior', status: user?.student?.behavior_discipline_records ? 'completed' : 'not completed' }
  ];

  if (!user) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-zinc-900 min-h-screen">
      {/* Profile Overview Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Profile Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profileSections.map((section, index) => (
            <Link
              key={index}
              to={section.path}
              className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm border-l-[3px] border-l-[#FF6B00] p-5 hover:shadow-md transition-shadow cursor-pointer block"
            >
              <div className="flex items-start justify-between mb-3">
                <section.icon className="w-6 h-6 text-[#FF6B00] dark:text-orange-400" />
                {section.status === 'completed' ? (
                  <FiCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                ) : (
                  <FiInfo className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                )}
              </div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                {section.title}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {section.status === 'completed' ? 'Information available' : 'Not completed'}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Right side: Upcoming Events & My Registrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              Upcoming Events
            </h2>
            <Link
              to="/student/events"
              className="text-sm text-[#FF6B00] dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
            >
              View All
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
              <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-6">
              <FiCalendar className="mx-auto text-3xl text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.event_id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/50 rounded-lg flex items-center justify-center">
                    <FiCalendar className="w-5 h-5 text-[#FF6B00] dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-gray-100">
                      {event.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(event.start_datetime).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                    {event.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiCheckCircle className="w-5 h-5 text-[#FF6B00] dark:text-orange-400" />
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              My Registrations
            </h2>
          </div>
          {loading ? (
            <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
          ) : registeredCount > 0 ? (
            <div>
              <p className="text-gray-800 dark:text-gray-300 text-sm mb-3">
                You have registered for <strong>{registeredCount}</strong> event{registeredCount !== 1 && 's'}.
              </p>
              <Link
                to="/student/events"
                className="inline-block px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
              >
                View My Events
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <p className="text-gray-800 dark:text-gray-300 text-sm mb-3 text-center">
                You haven't registered for any events yet
              </p>
              <Link
                to="/student/events"
                className="px-4 py-2 border border-gray-800 dark:border-gray-400 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Browse Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;