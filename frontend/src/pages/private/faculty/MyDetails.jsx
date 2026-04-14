import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FiMail, FiPhone, FiMapPin, FiBriefcase, FiEdit, FiUser } from 'react-icons/fi';

export const MyDetails = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  const facultyProfile = user.faculty || {};

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} p-6 lg:p-8`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
            Faculty Information
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#ff6b00] hover:bg-orange-600 text-white font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25"
          >
            <FiEdit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className={`${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} rounded-2xl p-8 shadow-xl`}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <FiUser className="w-4 h-4" />
                  First Name
                </label>
                <p className="text-gray-800 dark:text-white text-lg font-semibold">
                  {user.firstname || 'John'}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <FiUser className="w-4 h-4" />
                  Last Name
                </label>
                <p className="text-gray-800 dark:text-white text-lg font-semibold">
                  {user.lastname || 'Smith'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <FiMail className="w-4 h-4" />
                  Email
                </label>
                <a
                  href={`mailto:${user.email}`}
                  className="text-gray-800 dark:text-white text-lg font-semibold hover:text-[#ff6b00] transition-colors"
                >
                  {user.email || 'john.smith@university.edu'}
                </a>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <FiPhone className="w-4 h-4" />
                  Phone
                </label>
                <p className="text-gray-800 dark:text-white text-lg font-semibold">
                  {user.contact_number || '+1 (555) 123-4567'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <FiBriefcase className="w-4 h-4" />
                  Department
                </label>
                <p className="text-gray-800 dark:text-white text-lg font-semibold">
                  {facultyProfile.department || 'Computer Science'}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <FiBriefcase className="w-4 h-4" />
                  Position
                </label>
                <p className="text-gray-800 dark:text-white text-lg font-semibold">
                  {facultyProfile.position || 'Associate Professor'}
                </p>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <FiMapPin className="w-4 h-4" />
                Office Location
              </label>
              <p className="text-gray-800 dark:text-white text-lg font-semibold">
                {facultyProfile.office_location || 'Building A, Room 301'}
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <FiBriefcase className="w-4 h-4" />
                Bio
              </label>
              <p className="text-gray-800 dark:text-white text-base font-medium leading-relaxed">
                {facultyProfile.specialization || 'Specialized in artificial intelligence and machine learning with over 10 years of teaching experience.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDetails;