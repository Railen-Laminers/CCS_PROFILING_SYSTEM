import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiSun, FiMoon, FiUser, FiMenu, FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';

export const Header = ({ onMenuClick }) => {
  const { user, logout, isProcessing } = useAuth();
  const { theme, toggleTheme, systemTitle, logoUrl } = useTheme();
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

  return (
    <header className="bg-white dark:bg-[#1E1E1E] backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 h-[76px] flex justify-between items-center sticky top-0 z-40 transition-colors duration-300 shadow-sm relative flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open menu"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="System logo"
              className="h-9 w-9 rounded-xl object-contain bg-white/60 dark:bg-zinc-900/30 border border-gray-200 dark:border-gray-800 p-1"
            />
          ) : null}
          <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100 tracking-tight">
            {systemTitle || 'CCS Comprehensive Profiling System'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 rounded-xl"
          aria-label="Search"
        >
          <FiSearch className="w-5 h-5 stroke-[2]" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 dark:text-zinc-400 hover:text-brand-500 dark:hover:text-brand-400 rounded-xl transition-colors"
          aria-label="Notifications"
        >
          <FiBell className="w-5 h-5 stroke-[2]" />
          <span className="absolute top-2 right-2 block w-[6px] h-[6px] bg-brand-500 rounded-full border-[1.5px] border-white dark:border-surface-dark shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse"></span>
        </Button>

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
            className="w-8 h-8 rounded-full shadow-sm ring-1 ring-[#FF6B00] ring-offset-1 ring-offset-white dark:ring-offset-gray-900 shadow-lg shadow-[#FF6B00]/30"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={`${user?.firstname} ${user?.lastname}`}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FiUser className="w-4 h-4 stroke-[2.5]" />
            )}
          </Button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-surface-secondary shadow-xl border border-gray-100 dark:border-border-dark py-1 z-50 overflow-hidden rounded-2xl ring-1 ring-black ring-opacity-5 origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-border-dark bg-gray-50/50 dark:bg-surface-dark/50 flex items-center gap-3">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 capitalize">
                    {user?.role || 'User'}
                  </p>
                </div>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile'); // Always go to profile page
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors duration-150"
                >
                  {isStudent ? 'Change Password' : 'Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors duration-150 flex items-center gap-2"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isProcessing}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-150 flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      Logging out...
                    </>
                  ) : (
                    'Logout'
                  )}
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