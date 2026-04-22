import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { instructionAPI } from '@/services/api';
import {
  FiClock,
  FiUsers,
  FiBook,
  FiCalendar,
  FiCheckCircle,
  FiChevronRight,
  FiLoader,
} from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="group relative overflow-hidden bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-5 transition-all duration-300 hover:border-orange-500 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10">
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const ClassItem = ({ course, day, time, room, students }) => (
  <div className="group relative flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-orange-500/30">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-l-xl" />
    <div className="pl-4">
      <h4 className="font-semibold text-gray-800 dark:text-white text-lg">{course}</h4>
      <div className="flex items-center gap-4 mt-1 text-gray-500 dark:text-gray-400 text-sm">
        <span className="flex items-center gap-1">
          <FiCalendar className="w-4 h-4" />
          {day}
        </span>
        <span className="flex items-center gap-1">
          <FiClock className="w-4 h-4" />
          {time}
        </span>
        <span className="flex items-center gap-1">
          <FiBook className="w-4 h-4" />
          {room}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-500/20 rounded-full">
      <FiUsers className="w-4 h-4 text-orange-600 dark:text-orange-400" />
      <span className="text-orange-700 dark:text-orange-400 font-medium">{students}</span>
    </div>
  </div>
);

export const FacultyDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const facultyInfo = user?.faculty || {};
  const facultyId = facultyInfo._id;

  useEffect(() => {
    const fetchClasses = async () => {
      if (!facultyId) {
        setLoading(false);
        return;
      }
      try {
        const data = await instructionAPI.getClasses({ instructor_id: facultyId });
        setClasses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
        setError(err.message || 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [facultyId]);

  const totalCourses = new Set(classes.map(c => c.course_id?._id).filter(Boolean)).size;
  const totalStudents = classes.reduce((sum, c) => sum + (c.students_count || 0), 0);
  const totalClasses = classes.length;

  const today = new Date().toISOString().split('T')[0];
  const upcomingClasses = classes
    .filter(c => c.schedule?.date >= today)
    .sort((a, b) => a.schedule?.date.localeCompare(b.schedule?.date))
    .slice(0, 4);

  const getDayName = (dateStr) => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatTimeRange = (start, end) => {
    if (!start || !end) return 'TBD';
    return `${start} - ${end}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FiLoader className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error loading dashboard: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header with faculty brief info */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 text-gray-500 dark:text-gray-400">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
              {facultyInfo.department || 'Department not set'}
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
              {facultyInfo.position || 'Position not set'}
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
              {facultyInfo.specialization || 'Specialization not set'}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FiBook}
            label="Active Courses"
            value={totalCourses}
            color="from-orange-500 to-orange-600"
          />
          <StatCard
            icon={FiUsers}
            label="Total Students"
            value={totalStudents}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={FiClock}
            label="Total Classes"
            value={totalClasses}
            color="from-yellow-500 to-yellow-600"
          />
          <StatCard
            icon={FiCheckCircle}
            label="Upcoming Classes"
            value={upcomingClasses.length}
            color="from-green-500 to-green-600"
          />
        </div>

        {/* Upcoming Classes Section */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Upcoming Classes</h2>
            <Link
              to="/faculty/my-schedule"
              className="flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium transition-colors"
            >
              View All <FiChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingClasses.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No upcoming classes scheduled.
              </p>
            ) : (
              upcomingClasses.map((cls) => (
                <ClassItem
                  key={cls._id}
                  course={cls.course_id?.course_title || 'Untitled Course'}
                  day={getDayName(cls.schedule?.date)}
                  time={formatTimeRange(cls.schedule?.startTime, cls.schedule?.endTime)}
                  room={cls.room_id?.name || 'No room assigned'}
                  students={cls.students_count || 0}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;