import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiSun, FiMoon, FiUser, FiMenu, FiInfo, FiChevronsLeft, FiChevronsRight, FiSettings, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';
import { useToast } from '@/contexts/ToastContext';

export const Header = ({ onMenuClick, onToggleSidebar, sidebarCollapsed }) => {
  const { user, logout, isProcessing } = useAuth();
  const { theme, toggleTheme, systemTitle, logoUrl, academicYear, semester } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      showToast(err.message || 'Logout failed. Please try again.', 'error');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profilePicture = user?.profile_picture;
  const isStudent = user?.role === 'student';
  const initials = `${user?.firstname?.[0] || ''}${user?.lastname?.[0] || ''}`.toUpperCase();

  return (
    <header className="bg-white dark:bg-[#1E1E1E] backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 h-[68px] flex justify-between items-center sticky top-0 z-40 transition-all duration-300 shadow-sm relative flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open menu"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 -ml-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? (
            <FiChevronsRight className="w-5 h-5" />
          ) : (
            <FiChevronsLeft className="w-5 h-5" />
          )}
        </button>

        <div className="flex lg:hidden items-center gap-2.5">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="System logo"
              className="h-8 w-8 rounded-xl object-contain bg-white/60 dark:bg-zinc-900/30 border border-gray-200 dark:border-gray-800 p-1"
            />
          ) : null}
          <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100 tracking-tight">
            {systemTitle || 'CCS Profiling'}
          </h1>
        </div>
      </div>

      {/* System Status / Active Term Display */}
      <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800/50 rounded-full shadow-inner-sm group hover:border-brand-500/20 transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse shadow-[0_0_8px_rgba(255,107,0,0.4)]" />
          <span className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 whitespace-nowrap uppercase tracking-widest group-hover:text-brand-500 transition-colors">
            {semester || 'N/A'}
          </span>
        </div>
        <div className="w-px h-3 bg-gray-200 dark:bg-gray-800" />
        <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 tracking-[0.12em] whitespace-nowrap uppercase group-hover:text-gray-600 dark:group-hover:text-zinc-300 transition-colors">
          AY {academicYear || 'N/A'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown size="md" />

        <div className="flex items-center gap-2">
          <FiSun className={`w-5 h-5 transition-colors duration-300 stroke-[2] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          <button
            onClick={toggleTheme}
            className="relative flex items-center w-[32px] h-[18px] bg-gray-200 dark:bg-gray-700 rounded-full p-[2px] transition-colors duration-300 focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-600 shadow-inner"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <div
              className={`absolute w-[14px] h-[14px] bg-white dark:bg-slate-300 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-[14px]' : 'translate-x-0'}`}
            />
          </button>
          <FiMoon className={`w-5 h-5 transition-colors duration-300 stroke-[2] ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
        </div>

        <div className="relative pl-1 sm:pl-0" ref={dropdownRef}>
          <Button
            variant="primary"
            size="icon"
            className="w-[30px] h-[30px] rounded-full shadow-sm ring-1 ring-[#FF6B00] ring-offset-1 ring-offset-white dark:ring-offset-gray-900 shadow-lg shadow-[#FF6B00]/20"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={`${user?.firstname} ${user?.lastname}`}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FiUser className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
          </Button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 p-1 z-50 overflow-hidden rounded-2xl origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
              {/* User Identity Header */}
              <div className="px-4 py-3.5 mb-1 border-b border-gray-100 dark:border-gray-800/50 flex items-center gap-3.5">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-gray-50 dark:ring-white/5"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <span className="text-[13px] font-bold text-brand-500 tracking-wider">{initials}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100 truncate leading-tight mb-0.5">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-[10px] font-black text-[#FF6B00] uppercase tracking-[0.15em] opacity-90">
                    {user?.role || 'User'}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-[#FF6B00]/10 transition-colors">
                    <FiUser className="w-3.5 h-3.5" />
                  </div>
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-[#FF6B00]/10 transition-colors">
                    <FiSettings className="w-3.5 h-3.5" />
                  </div>
                  <span>Settings</span>
                </button>

                <div className="my-1.5 border-t border-gray-100 dark:border-gray-800/50" />

                <button
                  onClick={handleLogout}
                  disabled={isProcessing}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 group disabled:opacity-50"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                    {isProcessing ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiLogOut className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span>{isProcessing ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;