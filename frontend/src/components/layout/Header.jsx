import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
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

  return (
    <header className="bg-white/70 dark:bg-surface-secondary/30 backdrop-blur-md border-b border-gray-200/50 dark:border-white/10 px-6 h-[76px] flex justify-between items-center sticky top-0 z-40 transition-colors duration-300 shadow-sm relative flex-shrink-0">
      {/* Decorative subtle top border/glow if needed, but no inner ring since it's flat now */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100 tracking-tight">
          CCS Comprehensive Profiling System
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Search Button */}
        <Button 
          variant="ghost"
          size="icon"
          className="text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 rounded-xl"
          aria-label="Search"
        >
          <FiSearch className="w-5 h-5 stroke-[2]" />
        </Button>

        {/* Notifications Button */}
        <Button 
          variant="ghost"
          size="icon"
          className="relative text-gray-500 dark:text-zinc-400 hover:text-brand-500 dark:hover:text-brand-400 rounded-xl transition-colors"
          aria-label="Notifications"
        >
          <FiBell className="w-5 h-5 stroke-[2]" />
          {/* Notification Badge */}
          <span className="absolute top-2 right-2 block w-[6px] h-[6px] bg-brand-500 rounded-full border-[1.5px] border-white dark:border-surface-dark shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse"></span>
        </Button>

        {/* Theme Toggle Switch */}
        <div className="flex items-center gap-2">
          <FiSun className={`w-5 h-5 transition-colors duration-300 stroke-[2] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          <button
            onClick={toggleTheme}
            className="relative flex items-center w-[32px] h-[18px] bg-gray-200 dark:bg-gray-700 rounded-full p-[2px] transition-colors duration-300 focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-600 shadow-inner"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {/* Sliding indicator */}
            <div
              className={`absolute w-[14px] h-[14px] bg-white dark:bg-slate-300 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${
                theme === 'dark' ? 'translate-x-[14px]' : 'translate-x-0'
              }`}
            />
          </button>
          <FiMoon className={`w-5 h-5 transition-colors duration-300 stroke-[2] ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
        </div>

        {/* User Profile Dropdown */}
        <div className="relative pl-1 sm:pl-0" ref={dropdownRef}>
          <Button
            variant="primary"
            size="icon"
            className="w-8 h-8 rounded-full shadow-sm"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {/* Person silhouette avatar */}
            <FiUser className="w-4 h-4 stroke-[2.5]" />
          </Button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-surface-secondary shadow-xl border border-gray-100 dark:border-border-dark py-1 z-50 overflow-hidden rounded-2xl ring-1 ring-black ring-opacity-5 origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-border-dark bg-gray-50/50 dark:bg-surface-dark/50">
                <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 capitalize">
                  {user?.role || 'User'}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-150"
                >
                  Logout
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
