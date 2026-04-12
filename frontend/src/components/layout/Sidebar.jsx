import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  FiGrid,
  FiUsers,
  FiBookOpen,
  FiClock,
  FiCalendar,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';

const adminMenuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'Students', path: '/students', icon: FiUsers },
  { name: 'Faculty', path: '/faculty', icon: HiOutlineAcademicCap },
  { name: 'Instruction', path: '/instruction', icon: FiBookOpen },
  { name: 'Scheduling', path: '/scheduling', icon: FiClock },
  { name: 'Events', path: '/events', icon: FiCalendar },
  { name: 'Reports', path: '/reports', icon: FiFileText },
];

const studentMenuItems = [
  { name: 'Dashboard', path: '/student/dashboard', icon: FiGrid },
  { name: 'My Events', path: '/student/my-events', icon: FiCalendar },
  { name: 'My Schedule', path: '/student/my-schedule', icon: FiClock },
  { name: 'My Curriculum', path: '/student/my-curriculum', icon: FiBookOpen },
  { name: 'My Details', path: '/student/my-details', icon: FiUsers },
];

const facultyMenuItems = [
  { name: 'Dashboard', path: '/faculty/dashboard', icon: FiGrid },
  { name: 'My Schedule', path: '/faculty/my-schedule', icon: FiClock },
  { name: 'My Students', path: '/faculty/my-students', icon: FiUsers },
  { name: 'My Details', path: '/faculty/my-details', icon: FiUsers },
];

const useDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDesktop;
};

const Sidebar = ({ isMobileDrawerOpen, setMobileDrawerOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isDesktop = useDesktop();

  const getMenuItems = () => {
    if (!user) return adminMenuItems;
    switch (user.role) {
      case 'student': return studentMenuItems;
      case 'faculty': return facultyMenuItems;
      default: return adminMenuItems;
    }
  };

  const menuItems = getMenuItems();
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    if (isMobileDrawerOpen) setMobileDrawerOpen(false);
  }, [location.pathname]);

  const DesktopSidebar = () => (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-white dark:bg-[#1E1E1E] border-r border-gray-200 dark:border-gray-800 z-20 shadow-sm relative flex-shrink-0",
        desktopCollapsed ? "w-20" : "w-64",
        "transition-[width] duration-300 ease-in-out will-change-[width] transform-gpu"
      )}
    >
      {/* Toggle button – centered when collapsed, right when expanded */}
      <div
        className={cn(
          "flex p-2 border-b border-gray-200 dark:border-gray-800 transition-all duration-300",
          desktopCollapsed ? "justify-center" : "justify-end"
        )}
      >
        <button
          onClick={() => setDesktopCollapsed(!desktopCollapsed)}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {desktopCollapsed ? (
            <FiChevronRight className="w-5 h-5" />
          ) : (
            <FiChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 pt-4 pb-4 overflow-x-hidden">
        <ul className="space-y-1.5 px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink to={item.path}>
                {({ isActive }) => (
                  <div
                    className={cn(
                      "relative flex items-center h-11 text-[15px] rounded-xl transition-all duration-200 group",
                      isActive
                        ? "text-brand-500 font-semibold bg-brand-500/10 dark:bg-brand-500/10"
                        : "text-gray-600 dark:text-zinc-400 font-medium hover:bg-gray-100 dark:hover:bg-surface-secondary hover:text-gray-900 dark:hover:text-zinc-100",
                      desktopCollapsed ? "justify-center px-0" : "justify-start px-4 gap-3"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-brand-500 rounded-r-full" />
                    )}
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        isActive ? "text-brand-500" : "group-hover:text-gray-900 dark:group-hover:text-zinc-100"
                      )}
                    />
                    {!desktopCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );

  const MobileDrawer = () => (
    <>
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isMobileDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileDrawerOpen(false)}
      />
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#1E1E1E] shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Menu</h2>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close menu"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 pt-4 pb-6 overflow-y-auto">
          <ul className="space-y-1.5 px-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink to={item.path} onClick={() => setMobileDrawerOpen(false)}>
                  {({ isActive }) => (
                    <div
                      className={cn(
                        "relative flex items-center gap-3 px-4 h-11 text-[15px] rounded-xl transition-all duration-200",
                        isActive
                          ? "text-brand-500 font-semibold bg-brand-500/10 dark:bg-brand-500/10"
                          : "text-gray-600 dark:text-zinc-400 font-medium hover:bg-gray-100 dark:hover:bg-surface-secondary"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-brand-500 rounded-r-full" />
                      )}
                      <item.icon className={cn("w-5 h-5", isActive ? "text-brand-500" : "")} />
                      <span>{item.name}</span>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileDrawer />
    </>
  );
};

export default Sidebar;