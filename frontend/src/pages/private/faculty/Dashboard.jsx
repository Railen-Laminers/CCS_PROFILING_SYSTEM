import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  FiGrid, 
  FiClock, 
  FiUsers, 
  FiUser, 
  FiBook, 
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiPlusCircle,
  FiEye,
  FiFileText,
  FiChevronRight
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

const ActivityItem = ({ icon: Icon, text, time, type }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/10">
    <div className={`p-2 rounded-lg ${type === 'success' ? 'bg-green-100 dark:bg-green-500/20' : 'bg-yellow-100 dark:bg-yellow-500/20'}`}>
      <Icon className={`w-5 h-5 ${type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
    </div>
    <div className="flex-1">
      <p className="text-gray-800 dark:text-white font-medium">{text}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{time}</p>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, label, to }) => (
  <Link
    to={to}
    className="group relative flex flex-col items-center justify-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1"
  >
    <div className="relative">
      <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg group-hover:scale-110 group-hover:shadow-orange-500/30 transition-all duration-300">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <p className="mt-4 text-gray-800 dark:text-white font-semibold text-center">{label}</p>
    </div>
  </Link>
);

export const FacultyDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const upcomingClasses = [
    { course: 'CS 101 - Introduction to Programming', day: 'Monday', time: '9:00 AM - 11:00 AM', room: 'Room 301', students: 35 },
    { course: 'CS 201 - Data Structures', day: 'Tuesday', time: '1:00 PM - 3:00 PM', room: 'Room 205', students: 28 },
    { course: 'CS 301 - Algorithm Design', day: 'Wednesday', time: '9:00 AM - 11:00 AM', room: 'Room 301', students: 22 },
    { course: 'CS 401 - Capstone Project', day: 'Thursday', time: '2:00 PM - 4:00 PM', room: 'Lab 102', students: 15 },
  ];

  const recentActivity = [
    { icon: FiCheckCircle, text: 'Grades submitted for CS 101', time: '2 hours ago', type: 'success' },
    { icon: FiCheckCircle, text: 'Schedule request approved', time: '5 hours ago', type: 'success' },
    { icon: FiAlertCircle, text: 'Pending schedule review - CS 301', time: '1 day ago', type: 'warning' },
    { icon: FiCheckCircle, text: 'Attendance report uploaded', time: '2 days ago', type: 'success' },
  ];

  const quickActions = [
    { icon: FiFileText, label: 'Submit Grades', to: '/faculty/my-students' },
    { icon: FiPlusCircle, label: 'Add Schedule', to: '/faculty/my-schedule' },
    { icon: FiUsers, label: 'View Students', to: '/faculty/my-students' },
    { icon: FiCalendar, label: 'View Schedule', to: '/faculty/my-schedule' },
  ];

  if (!user) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Overview
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={FiBook} 
            label="Active Courses" 
            value="4" 
            color="from-orange-500 to-orange-600" 
          />
          <StatCard 
            icon={FiUsers} 
            label="Total Students" 
            value="127" 
            color="from-blue-500 to-blue-600" 
          />
          <StatCard 
            icon={FiClock} 
            label="Pending Schedules" 
            value="2" 
            color="from-yellow-500 to-yellow-600" 
          />
          <StatCard 
            icon={FiCheckCircle} 
            label="Approved Schedules" 
            value="12" 
            color="from-green-500 to-green-600" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Upcoming Classes</h2>
              <Link to="/faculty/my-schedule" className="flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium transition-colors">
                View All <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingClasses.map((cls, index) => (
                <ClassItem key={index} {...cls} />
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Activity</h2>
              <Link to="/faculty/my-details" className="flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium transition-colors">
                View All <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;