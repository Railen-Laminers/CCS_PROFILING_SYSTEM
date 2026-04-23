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
  FiUser,
} from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';

const adminMenuItems = [
  {
    category: 'Overview',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
      { name: 'Reports', path: '/reports', icon: FiFileText },
    ]
  },
  {
    category: 'Management',
    items: [
      { name: 'Students', path: '/students', icon: FiUsers },
      { name: 'Faculty', path: '/faculty', icon: HiOutlineAcademicCap },
    ]
  },
  {
    category: 'Operations',
    items: [
      { name: 'Instruction', path: '/instruction', icon: FiBookOpen },
      { name: 'Scheduling', path: '/scheduling', icon: FiClock },
      { name: 'Events', path: '/events', icon: FiCalendar },
    ]
  }
];

const studentMenuItems = [
  {
    category: 'Overview',
    items: [
      { name: 'Dashboard', path: '/student/dashboard', icon: FiGrid },
    ]
  },
  {
    category: 'Records',
    items: [
      { name: 'Personal Info', path: '/student/my-details', icon: FiUsers },
      { name: 'Academic', path: '/student/academic', icon: FiBookOpen },
      { name: 'Medical', path: '/student/medical', icon: FiHeart },
      { name: 'Behavior', path: '/student/behavior', icon: FiAlertTriangle },
    ]
  },
  {
    category: 'Activities',
    items: [
      { name: 'Sports & Activities', path: '/student/sports', icon: FiAward },
      { name: 'Organizations', path: '/student/organizations', icon: FiUsers },
      { name: 'Events & Competitions', path: '/student/events', icon: FiCalendar },
    ]
  }
];

const facultyMenuItems = [
  {
    category: 'Overview',
    items: [
      { name: 'Dashboard', path: '/faculty/dashboard', icon: FiGrid },
      { name: 'Profile', path: '/faculty/my-details', icon: FiUsers },
    ]
  },
  {
    category: 'Management',
    items: [
      { name: 'Scheduling', path: '/faculty/my-schedule', icon: FiClock },
      { name: 'Skills', path: '/faculty/skills', icon: FiStar },
    ]
  }
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

// Premium User Profile Header
const RoleBadge = ({ collapsed, roleInfo }) => {
  if (collapsed) return null;

  return (
    <div className={cn(
      "flex items-center gap-3 transition-all duration-300 overflow-hidden",
      "px-1 flex-1"
    )}>
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-orange-600 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        <span className="text-sm font-bold">{roleInfo.initial}</span>
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate capitalize">
          {roleInfo.full}
        </span>
        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
          Workspace
        </span>
      </div>
    </div>
  );
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

  const getRoleInfo = () => {
    if (!user) return { full: 'User', initial: 'U' };
    switch (user.role) {
      case 'admin': return { full: 'Admin', initial: 'A' };
      case 'student': return { full: 'Student', initial: 'S' };
      case 'faculty': return { full: 'Faculty', initial: 'F' };
      default: return { full: 'User', initial: 'U' };
    }
  };

  const roleInfo = getRoleInfo();

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
      {/* Top bar with role badge and collapse button */}
      <div
        className={cn(
          "flex items-center border-b border-gray-200 dark:border-gray-800 p-3 transition-all duration-300",
          desktopCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <RoleBadge collapsed={desktopCollapsed} roleInfo={roleInfo} />
        <button
          onClick={() => setDesktopCollapsed(!desktopCollapsed)}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
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
        <div className="space-y-6">
          {menuItems.map((group, groupIdx) => (
            <div key={groupIdx}>
              {!desktopCollapsed && (
                <div className="px-6 mb-2 mt-1">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {group.category}
                  </p>
                </div>
              )}
              <ul className="space-y-1.5 px-2">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <NavLink to={item.path}>
                      {({ isActive }) => (
                        <div
                          className={cn(
                            "relative flex items-center h-11 text-[15px] rounded-xl transition-all duration-200 group",
                            isActive
                              ? "text-[#FF6B00] font-semibold bg-[#FF6B00]/10"
                              : "text-gray-600 dark:text-zinc-400 font-medium hover:bg-gray-100 dark:hover:bg-surface-secondary hover:text-gray-900 dark:hover:text-zinc-100",
                            desktopCollapsed ? "justify-center px-0" : "justify-start px-4 gap-3"
                          )}
                        >
                          {isActive && (
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
            </div>
          ))}
        </div>
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
        {/* Mobile header: subtle role badge (always expanded style) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <RoleBadge collapsed={false} roleInfo={roleInfo} />
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close menu"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 pt-4 pb-6 overflow-y-auto">
          <div className="space-y-6">
            {menuItems.map((group, groupIdx) => (
              <div key={groupIdx}>
                <div className="px-6 mb-2 mt-1">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {group.category}
                  </p>
                </div>
                <ul className="space-y-1.5 px-3">
                  {group.items.map((item) => (
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
              </div>
            ))}
          </div>
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