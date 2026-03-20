import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaTh, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white text-gray-800 flex flex-col shadow-lg rounded-r-2xl overflow-hidden">
      <nav className="flex-1 pt-6 pb-4">
        <ul className="space-y-1 px-3">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <FaTh className="text-lg" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Admin-only links */}
          {user?.role === 'admin' && (
            <>
              <li>
                <NavLink
                  to="/students"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <FaUserGraduate className="text-lg" />
                  <span>Students</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/faculty"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <FaChalkboardTeacher className="text-lg" />
                  <span>Faculty</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;