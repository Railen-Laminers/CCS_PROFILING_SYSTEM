import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
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
  FiChevronsLeft,
  FiChevronsRight,
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
  },
  {
    category: 'Analytics',
    items: [
      { name: 'Reports', path: '/reports', icon: FiFileText },
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
    ]
  },
  {
    category: 'Personal',
    items: [
      { name: 'Profile', path: '/faculty/my-details', icon: FiUsers },
      { name: 'Skills', path: '/faculty/skills', icon: FiStar },
    ]
  },
  {
    category: 'Management',
    items: [
      { name: 'Scheduling', path: '/faculty/my-schedule', icon: FiClock },
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
const RoleBadge = ({ collapsed, roleInfo, user }) => {
  if (collapsed) return null;

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 truncate">
        {user?.firstname} {user?.lastname}
      </span>
      <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-[0.15em] truncate">
        {roleInfo.full} Workspace
      </span>
    </div>
  );
};

const Sidebar = ({ isMobileDrawerOpen, setMobileDrawerOpen, collapsed }) => {
  const { user } = useAuth();
  const { logoUrl } = useTheme();
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
        collapsed ? "w-20" : "w-[276px]",
        "transition-[width] duration-300 ease-in-out will-change-[width] transform-gpu"
      )}
    >
      {/* Minimal Brand Section */}
      <div
        className={cn(
          "flex items-center transition-all duration-300",
          collapsed ? "h-[76px] justify-center px-0" : "h-[88px] justify-between px-6"
        )}
      >
        <div className="flex items-center gap-3.5 overflow-hidden">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-11 w-11 object-contain transition-all duration-500 opacity-90"
            />
          )}
          
          {!collapsed && (
            <h1 className="text-[19px] font-bold text-gray-800 dark:text-gray-100 tracking-tight whitespace-nowrap">
              CCS Profiling
            </h1>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
        <div className={cn("space-y-9", collapsed && "space-y-3")}>
          {menuItems.map((group, groupIdx) => (
            <div key={groupIdx} className={cn("space-y-2", collapsed && "space-y-0")}>
              {!collapsed && (
                <div className="px-4 mb-2">
                  <p className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-[0.2em]">
                    {group.category}
                  </p>
                </div>
              )}
              <ul className={cn("space-y-1", collapsed && "space-y-0.5")}>
                {group.items.map((item) => (
                  <li key={item.name}>
                    <NavLink to={item.path}>
                      {({ isActive }) => (
                        <div
                          className={cn(
                            "relative flex items-center h-[48px] text-[15.5px] rounded-xl transition-all duration-200 group",
                            isActive
                              ? "text-[#FF6B00] font-semibold bg-[#FF6B00]/10"
                              : "text-gray-900 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/[0.03]",
                            collapsed ? "justify-center px-0" : "px-4 gap-4"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-[22px] h-[22px] transition-colors",
                              isActive ? "text-[#FF6B00]" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                            )}
                          />
                          {!collapsed && <span className="truncate">{item.name}</span>}
                          
                          {collapsed && (
                            <div className="fixed left-[70px] px-2.5 py-1.5 bg-gray-900 text-white text-[11px] rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                              {item.name}
                            </div>
                          )}
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

      {/* System Environment Footer */}
      <div className="p-6 mt-auto border-t border-gray-100 dark:border-gray-800/50">
        {!collapsed ? (
          <div className="flex flex-col gap-4 animate-in fade-in duration-700">
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-[0.2em]">
                Environment
              </p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                  {roleInfo.full} Workspace
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div 
              className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 flex items-center justify-center group/env cursor-help relative"
              title={`${roleInfo.full} Workspace`}
            >
              <span className="text-[10px] font-black text-[#FF6B00] uppercase">
                {roleInfo.full.charAt(0)}
              </span>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FF6B00] rounded-full border border-white dark:border-[#1E1E1E]" />
            </div>
          </div>
        )}
      </div>
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
          "lg:hidden fixed top-0 left-0 h-full w-[276px] bg-white dark:bg-[#1E1E1E] shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-6 h-[76px] border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
             {logoUrl && <img src={logoUrl} alt="Logo" className="h-8 w-8" />}
             <h1 className="text-[16px] font-bold text-gray-800 dark:text-gray-100">CCS Profiling</h1>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-8 overflow-y-auto">
          <div className="space-y-10">
            {menuItems.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-3">
                <div className="px-4">
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
                    {group.category}
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <NavLink to={item.path} onClick={() => setMobileDrawerOpen(false)}>
                        {({ isActive }) => (
                          <div
                            className={cn(
                              "flex items-center gap-4 px-4 h-[44px] text-[15px] rounded-lg transition-all",
                              isActive
                                ? "text-[#FF6B00] font-semibold bg-[#FF6B00]/5"
                                : "text-gray-500 dark:text-gray-400"
                            )}
                          >
                            <item.icon className={cn("w-[20px] h-[20px]", isActive ? "text-[#FF6B00]" : "text-gray-400")} />
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
        
        {/* Mobile User Section */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FiUser className="w-4 h-4 text-gray-400" />
            </div>
            <RoleBadge collapsed={false} roleInfo={roleInfo} user={user} />
          </div>
        </div>
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