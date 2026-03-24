// Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiGrid, 
  FiUsers, 
  FiBriefcase, 
  FiBookOpen, 
  FiClock, 
  FiCalendar, 
  FiFileText, 
  FiSettings 
} from 'react-icons/fi';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'Students', path: '/students', icon: FiUsers },
  { name: 'Faculty', path: '/faculty', icon: FiBriefcase },
  { name: 'Instruction', path: '/instruction', icon: FiBookOpen },
  { name: 'Scheduling', path: '/scheduling', icon: FiClock },
  { name: 'Events', path: '/events', icon: FiCalendar },
  { name: 'Reports', path: '/reports', icon: FiFileText },
  { name: 'System Settings', path: '/settings', icon: FiSettings },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-[260px] bg-white dark:bg-[#1E1E1E] border-r border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 flex flex-col transition-all duration-300">
      <nav className="flex-1 pt-8 pb-4">
        <ul className="space-y-2 px-4">
          {menuItems.map((item, index) => {
            // Keep existing admin-only logic for items beyond Dashboard
            if (index > 0 && user?.role !== 'admin') return null;

            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 stroke-[1.5]" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;