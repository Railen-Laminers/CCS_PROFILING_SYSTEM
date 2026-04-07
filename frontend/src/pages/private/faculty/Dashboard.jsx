import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FaClock, FaUsers, FaUser, FaBook } from 'react-icons/fa';

export const FacultyDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-6 text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        Welcome, Prof. {user.lastname}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Faculty Dashboard • {user.faculty?.department || 'N/A'} • {user.faculty?.position || 'N/A'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/faculty/my-schedule"
          className="group block p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                My Schedule
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                View
              </p>
            </div>
            <FaClock className="text-blue-500 dark:text-blue-400 text-4xl group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          to="/faculty/my-students"
          className="group block p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-green-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                My Students
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
                View
              </p>
            </div>
            <FaUsers className="text-green-500 dark:text-green-400 text-4xl group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          to="/faculty/my-details"
          className="group block p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-purple-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                My Details
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                View
              </p>
            </div>
            <FaUser className="text-purple-500 dark:text-purple-400 text-4xl group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          to="/settings"
          className="group block p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-orange-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                Settings
              </p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-2">
                View
              </p>
            </div>
            <FaBook className="text-orange-500 dark:text-orange-400 text-4xl group-hover:scale-110 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FacultyDashboard;