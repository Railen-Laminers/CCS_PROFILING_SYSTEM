import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  FiGrid, 
  FiUsers, 
  FiBookOpen, 
  FiClock, 
  FiCalendar, 
  FiFileText, 
  FiSettings 
} from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'Students', path: '/students', icon: FiUsers },
  { name: 'Faculty', path: '/faculty', icon: HiOutlineAcademicCap },
  { name: 'Instruction', path: '/instruction', icon: FiBookOpen },
  { name: 'Scheduling', path: '/scheduling', icon: FiClock },
  { name: 'Events', path: '/events', icon: FiCalendar },
  { name: 'Reports', path: '/reports', icon: FiFileText },
  { name: 'System Settings', path: '/settings', icon: FiSettings },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white dark:bg-[#1E1E1E] border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <nav className="flex-1 pt-4 pb-4">
        <ul className="space-y-2 px-4">
          {menuItems.map((item, index) => {
            // Keep existing admin-only logic for items beyond Dashboard
            if (index > 0 && user?.role !== 'admin') return null;

            return (
              <li key={item.name}>
                <NavLink to={item.path}>
                  {({ isActive }) => (
                    <div className={cn(
                      "flex items-center gap-4 px-4 h-12 text-base rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-[#F97316] text-white font-semibold"
                        : "text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    )}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  )}
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
