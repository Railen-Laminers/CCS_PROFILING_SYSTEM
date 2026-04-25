import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { systemSettingsAPI } from '../services/api';
import axios from 'axios'; // Add axios import

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  const [brandingLoading, setBrandingLoading] = useState(true);
  const [systemTitle, setSystemTitle] = useState('CCS Comprehensive Profiling System');
  const [logoUrl, setLogoUrl] = useState(null);
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');

  // Update the DOM when theme changes
  useEffect(() => {
    const htmlElement = document.documentElement;

    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    // Persist preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const resolveLogoUrl = (nextLogoUrl) => {
    if (!nextLogoUrl) return null;
    if (nextLogoUrl.startsWith('http')) return nextLogoUrl;

    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const origin = base.replace(/\/api\/?$/, '');
    return `${origin}${nextLogoUrl}`;
  };

  // UPDATED: Handle CanceledError properly
  useEffect(() => {
    const controller = new AbortController();

    const loadBranding = async () => {
      try {
        setBrandingLoading(true);
        const settings = await systemSettingsAPI.get(controller.signal);
        setSystemTitle(settings?.systemTitle || 'CCS Comprehensive Profiling System');
        setLogoUrl(resolveLogoUrl(settings?.logoUrl));
        setAcademicYear(settings?.academicYear || '');
        setSemester(settings?.semester || '');
      } catch (err) {
        // Only log errors that aren't cancelation errors
        if (axios.isCancel(err)) {
          // This is expected - request was cancelled, do nothing
          return;
        }
        // Log real errors
        console.error('Failed to load branding settings:', err);
      } finally {
        if (!controller.signal.aborted) {
          setBrandingLoading(false);
        }
      }
    };

    loadBranding();
    return () => controller.abort();
  }, []);

  // Sync browser tab title with system settings title
  useEffect(() => {
    document.title = systemTitle?.trim() || 'CCS Comprehensive Profiling System';
  }, [systemTitle]);

  // Sync favicon with uploaded system logo (fallback to default static icon)
  useEffect(() => {
    const defaultIcon = '/CCS_logo.png';
    const iconHref = logoUrl || defaultIcon;

    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      document.head.appendChild(favicon);
    }

    favicon.setAttribute('href', iconHref);
  }, [logoUrl]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDark: theme === 'dark',
      isLight: theme === 'light',
      brandingLoading,
      systemTitle,
      logoUrl,
      academicYear,
      semester,
      refreshBranding: async () => {
        try {
          const settings = await systemSettingsAPI.get();
          setSystemTitle(settings?.systemTitle || 'CCS Comprehensive Profiling System');
          setLogoUrl(resolveLogoUrl(settings?.logoUrl));
          setAcademicYear(settings?.academicYear || '');
          setSemester(settings?.semester || '');
        } catch (err) {
          if (!axios.isCancel(err)) {
            console.error('Failed to refresh branding:', err);
          }
        }
      },
    }),
    [theme, brandingLoading, systemTitle, logoUrl, academicYear, semester]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}