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
    <aside className="w-64 bg-white dark:bg-[#1E1E1E] backdrop-blur-2xl border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300 z-20 shadow-sm relative flex-shrink-0">
      <nav className="flex-1 pt-6 pb-4">
        <ul className="space-y-1.5 px-4">
          {menuItems.map((item, index) => {
            // Keep existing admin-only logic for items beyond Dashboard
            if (index > 0 && user?.role !== 'admin') return null;

            return (
              <li key={item.name}>
                <NavLink to={item.path}>
                  {({ isActive }) => (
                    <div className={cn(
                      "relative flex items-center gap-3 px-4 h-11 text-[15px] rounded-xl transition-all duration-200 group",
                      isActive
                        ? "text-brand-500 font-semibold bg-brand-500/10 dark:bg-brand-500/10"
                        : "text-gray-600 dark:text-zinc-400 font-medium hover:bg-gray-100 dark:hover:bg-surface-secondary hover:text-gray-900 dark:hover:text-zinc-100"
                    )}>
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-brand-500 rounded-r-full"></div>
                      )}
                      <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-brand-500" : "group-hover:text-gray-900 dark:group-hover:text-zinc-100")} />
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
