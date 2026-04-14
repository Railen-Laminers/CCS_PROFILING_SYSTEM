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
  FiHeart,
  FiAlertTriangle,
  FiAward,
  FiFile,
  FiStar,
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
  { name: 'Personal Info', path: '/student/my-details', icon: FiUsers },
  { name: 'Academic', path: '/student/academic', icon: FiBookOpen },
  { name: 'Medical', path: '/student/medical', icon: FiHeart },
  { name: 'Sports & Activities', path: '/student/sports', icon: FiAward },
  { name: 'Organizations', path: '/student/organizations', icon: FiUsers },
  { name: 'Behavior', path: '/student/behavior', icon: FiAlertTriangle },
  { name: 'Events & Competitions', path: '/student/events', icon: FiCalendar },
];

const facultyMenuItems = [
  { name: 'Dashboard', path: '/faculty/dashboard', icon: FiGrid },
  { name: 'Profile', path: '/faculty/my-details', icon: FiUsers },
  { name: 'Scheduling', path: '/faculty/my-schedule', icon: FiClock },
  { name: 'Grades', path: '/faculty/my-students', icon: FiFile },
  { name: 'Skills', path: '/faculty/skills', icon: FiStar },
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

const GraduationIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path fillRule="evenodd" d="M12 2.25c-3.503 0-6.47.934-8.643 2.535l1.488-1.488a.75.75 0 011.06 0l1.992 1.992a.75.75 0 001.06 0l1.992-1.992a.75.75 0 011.06 0l1.992 1.992a.75.75 0 001.06 0l1.992-1.992a.75.75 0 011.06 0l1.488 1.488C17.63 3.17 15.37 2.25 12 2.25zM7.5 7.547c0-.862.377-1.635 1.047-2.185a4.477 4.477 0 016.906 0c.67.55 1.047 1.323 1.047 2.185v.994c0 2.69-1.603 4.872-3.914 5.786l-.36.264a.75.75 0 01-.732.002l-.36-.264C9.103 13.413 7.5 11.231 7.5 8.541v-.994z" clipRule="evenodd" />
    <path d="M7.5 9c0-2.69 1.603-4.872 3.914-5.786l.36-.264a.75.75 0 01.732-.002l.36.264C14.397 4.128 16 6.31 16 9v.994c0 .862-.377 1.635-1.047 2.185a4.477 4.477 0 01-6.906 0c-.67-.55-1.047-1.323-1.047-2.185V9z" />
  </svg>
);

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
      {/* Logo Header - Show for students */}
      {user?.role === 'student' && !desktopCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
           <h2 className="text-lg font-bold text-gray-800 dark:text-white">Student Portal</h2>
            <div>
              
             
            </div>
          </div>
        </div>
      )}

      {/* Collapse Button - Hide for students */}
      {user?.role !== 'student' && (
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
      )}

      <nav className="flex-1 pt-4 pb-4 overflow-x-hidden">
        <ul className="space-y-1.5 px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink to={item.path}>
                {({ isActive }) => (
                  <div
                    className={cn(
                      "relative flex items-center h-11 text-[15px] rounded-xl transition-all duration-200 group",
                      user?.role === 'student'
                        ? isActive
                          ? "bg-[#FF6B00] text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        : isActive
                          ? "text-[#FF6B00] font-semibold bg-[#FF6B00]/10"
                          : "text-gray-600 dark:text-zinc-400 font-medium hover:bg-gray-100 dark:hover:bg-surface-secondary hover:text-gray-900 dark:hover:text-zinc-100",
                      desktopCollapsed ? "justify-center px-0" : "justify-start px-4 gap-3"
                    )}
                  >
                    {user?.role !== 'student' && isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#FF6B00] rounded-r-full" />
                    )}
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        isActive ? "text-[#FF6B00]" : "group-hover:text-gray-900 dark:group-hover:text-zinc-100"
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
                            ? "text-[#FF6B00] font-semibold bg-[#FF6B00]/10"
                            : "text-gray-600 dark:text-zinc-400 font-medium hover:bg-gray-100 dark:hover:bg-surface-secondary"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#FF6B00] rounded-r-full" />
                        )}
                      <item.icon className={cn("w-5 h-5", isActive ? "text-[#FF6B00]" : "")} />
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