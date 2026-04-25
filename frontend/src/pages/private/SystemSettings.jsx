import { useEffect, useMemo, useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { systemSettingsAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import axios from 'axios';
import {
  FiUsers, FiDatabase, FiShield, FiHardDrive, FiUpload, FiPlus,
  FiSettings, FiMail, FiBell, FiLock, FiDroplet, FiGlobe, FiX,
  FiActivity, FiCheck, FiLayout, FiMonitor, FiSearch, FiSun, FiMoon,
  FiAlertTriangle, FiInfo
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex space-x-2 mb-8 overflow-x-auto p-2 bg-gray-100 dark:bg-[#252525] rounded-[1.25rem] border border-gray-200 dark:border-gray-800 shadow-inner">
    {tabs.map((tab, index) => (
      <button
        key={index}
        onClick={() => setActiveTab(index)}
        className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all rounded-[1.25rem] relative z-10 focus:outline-none ${activeTab === index
            ? 'bg-white dark:bg-[#1E1E1E] text-brand-600 dark:text-brand-500 shadow-sm ring-1 ring-zinc-200 dark:ring-white/10'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-[#2C2C2C]'
          }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const SEMESTER_ORDER = ["1st Semester", "2nd Semester", "Summer Term"];

const SystemSettings = () => {
  const { showToast } = useToast();
  const { theme, toggleTheme, isDark, refreshBranding } = useTheme();
  const { user, loading: authLoading } = useAuth();

  const isAdmin = user?.role === 'admin';

  // General settings state
  const [interfaceLanguage, setInterfaceLanguage] = useState('English - North America');
  const [academicYear, setAcademicYear] = useState(() => {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${currentYear + 1}`;
  });
  const [semester, setSemester] = useState('');
  const [storedLogoUrl, setStoredLogoUrl] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingAppearance, setSavingAppearance] = useState(false);
  const [initialSettings, setInitialSettings] = useState(null);
  const [showRolloverModal, setShowRolloverModal] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    if (selectedTheme === 'light' && isDark) toggleTheme();
    else if (selectedTheme === 'dark' && !isDark) toggleTheme();
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };
  const handleFileSelect = (file) => {
    setLogoFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    } else setLogoPreview(null);
  };
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handleChooseFileClick = () => fileInputRef.current?.click();

  const inputClasses = "w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-[13px]";
  const labelClasses = "block text-[11px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1";

  const apiOrigin = useMemo(() => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return base.replace(/\/api\/?$/, '');
  }, []);

  const resolvedLogoPreview = useMemo(() => {
    if (logoPreview) return logoPreview;
    if (!storedLogoUrl) return null;
    if (storedLogoUrl.startsWith('http')) return storedLogoUrl;
    return `${apiOrigin}${storedLogoUrl}`;
  }, [logoPreview, storedLogoUrl, apiOrigin]);

  useEffect(() => {
    const controller = new AbortController();
    const loadSettings = async () => {
      try {
        setLoadingSettings(true);
        const settings = await systemSettingsAPI.get(controller.signal);
        setInterfaceLanguage(settings?.interfaceLanguage || 'English - North America');
        setAcademicYear(settings?.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
        setSemester(settings?.semester || '1st Semester');
        setStoredLogoUrl(settings?.logoUrl || null);
        setInitialSettings({
          academicYear: settings?.academicYear,
          semester: settings?.semester
        });
      } catch (err) {
        if (!axios.isCancel(err)) console.error('Failed to load settings:', err);
      } finally {
        if (!controller.signal.aborted) setLoadingSettings(false);
      }
    };
    loadSettings();
    return () => controller.abort();
  }, []);

  // Automatically reset semester to 1st Semester when academic year changes
  useEffect(() => {
    if (initialSettings && academicYear !== initialSettings.academicYear) {
      setSemester('1st Semester');
    }
  }, [academicYear, initialSettings]);

  const handleSaveGeneral = async (confirmed = false) => {
    if (!isAdmin) return;

    // Detect if rollover (Term transition) is triggered
    // We compare current state values with the ones we loaded from the database
    const isYearChanged = academicYear !== initialSettings?.academicYear;
    const isSemesterChanged = semester !== initialSettings?.semester;
    const isRolloverTriggered = isYearChanged || isSemesterChanged;

    if (isRolloverTriggered && !confirmed) {
      setShowRolloverModal(true);
      return;
    }

    setSaveError(null);
    setSavingGeneral(true);
    try {
      const settings = await systemSettingsAPI.update({
        interfaceLanguage,
        academicYear,
        semester,
      });
      
      const newSettings = {
        interfaceLanguage: settings?.interfaceLanguage || 'English - North America',
        academicYear: settings?.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        semester: settings?.semester || '1st Semester',
        logoUrl: settings?.logoUrl || null
      };

      setInterfaceLanguage(newSettings.interfaceLanguage);
      setAcademicYear(newSettings.academicYear);
      setSemester(newSettings.semester);
      setStoredLogoUrl(newSettings.logoUrl);
      
      // Update initial settings to match new state
      setInitialSettings({
        academicYear: newSettings.academicYear,
        semester: newSettings.semester
      });

      setShowRolloverModal(false);
      showToast(isRolloverTriggered ? 'System rollover completed successfully!' : 'Settings updated successfully!', 'success');
      await refreshBranding?.();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save system settings';
      setSaveError(msg);
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleSaveAppearance = async () => {
    if (!isAdmin || !logoFile) return;
    setSaveError(null);
    setSavingAppearance(true);
    try {
      const settings = await systemSettingsAPI.update({
        interfaceLanguage,
        logo: logoFile,
      });
      setStoredLogoUrl(settings?.logoUrl || null);
      setLogoFile(null);
      setLogoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await refreshBranding?.();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to upload logo';
      setSaveError(msg);
    } finally {
      setSavingAppearance(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          System Configuration
        </h1>
      </div>

      <div className="space-y-10">
        {/* Rollover Confirmation Modal */}
        {showRolloverModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-md overflow-hidden shadow-2xl border-none animate-in zoom-in-95 duration-200">
              <CardHeader className="bg-amber-500/10 border-b border-amber-500/20 p-6">
                <CardTitle className="text-amber-600 dark:text-amber-500 flex items-center gap-3">
                  <div className="bg-amber-500/20 p-2 rounded-lg">
                    <FiAlertTriangle className="w-6 h-6" />
                  </div>
                  System Rollover Warning
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-600 dark:text-zinc-400 text-[14px] leading-relaxed">
                  You are about to change the <span className="font-bold text-gray-900 dark:text-white">Academic Year</span> or <span className="font-bold text-gray-900 dark:text-white">Semester</span>. This will trigger a system-wide rollover:
                </p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 text-[13px] text-gray-600 dark:text-zinc-400">
                    <div className="mt-1 text-amber-500"><FiCheck className="w-4 h-4" /></div>
                    Current student GPA and subjects will be <span className="font-semibold text-gray-900 dark:text-white">archived</span>.
                  </li>
                  <li className="flex items-start gap-3 text-[13px] text-gray-600 dark:text-zinc-400">
                    <div className="mt-1 text-red-500"><FiX className="w-4 h-4" /></div>
                    All current <span className="font-semibold text-gray-900 dark:text-white">Schedules, Lesson Plans, and Materials</span> will be deleted.
                  </li>
                  <li className="flex items-start gap-3 text-[13px] text-gray-600 dark:text-zinc-400">
                    <div className="mt-1 text-amber-500"><FiInfo className="w-4 h-4" /></div>
                    Student "Live" data will be reset to 0 for the new term.
                  </li>
                </ul>
                <div className="mt-10 flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setShowRolloverModal(false)}
                    disabled={savingGeneral}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white" 
                    onClick={() => handleSaveGeneral(true)}
                    loading={savingGeneral}
                  >
                    Confirm Rollover
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {saveError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {saveError}
          </div>
        )}

        {/* General System Info - Admin only */}
        {isAdmin && (
          <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
              <CardTitle className="text-[15px] font-bold flex items-center gap-3">
                <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/20">
                  <FiSettings className="w-5 h-5 text-brand-500" />
                </div>
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClasses}>
                    System Title <span className="lowercase font-normal opacity-60 italic ml-1">(Read-only)</span>
                  </label>
                  <input type="text" className={inputClasses} value="CCS Profiling" disabled readOnly />
                </div>
                <div>
                  <label className={labelClasses}>
                    Institution Name <span className="lowercase font-normal opacity-60 italic ml-1">(Read-only)</span>
                  </label>
                  <input type="text" className={inputClasses} value="College of Computing Studies" disabled readOnly />
                </div>
                <div>
                  <label className={labelClasses}>Academic Year (Start Year)</label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      className={`${inputClasses} pr-24`}
                      placeholder="e.g. 2025"
                      value={academicYear.split('-')[0]} 
                      onChange={(e) => {
                        const start = e.target.value;
                        if (!start) {
                          setAcademicYear('');
                          return;
                        }
                        const end = parseInt(start) + 1;
                        setAcademicYear(`${start}-${end}`);
                      }}
                      disabled={loadingSettings || savingGeneral} 
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-lg text-brand-500 text-xs font-bold pointer-events-none">
                      {academicYear.includes('-') ? `AY ${academicYear}` : 'SET YEAR'}
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Active Semester</label>
                  <select 
                    className={inputClasses} 
                    value={semester} 
                    onChange={(e) => setSemester(e.target.value)} 
                    disabled={loadingSettings || savingGeneral}
                  >
                    {SEMESTER_ORDER.map((sem) => {
                      const isYearChanged = initialSettings && academicYear !== initialSettings.academicYear;
                      
                      const isDisabled = initialSettings && (
                        (isYearChanged && sem !== "1st Semester") || 
                        (!isYearChanged && SEMESTER_ORDER.indexOf(sem) < SEMESTER_ORDER.indexOf(initialSettings.semester))
                      );

                      return (
                        <option key={sem} value={sem} disabled={isDisabled}>
                          {sem} {isDisabled && !isYearChanged ? '(Passed)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="mt-10 flex justify-end">
                <button onClick={() => handleSaveGeneral()} disabled={loadingSettings || savingGeneral} className="relative group overflow-hidden rounded-xl bg-brand-500 px-8 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                  <span className="relative z-10">{savingGeneral ? 'Saving…' : 'Save General Settings'}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brand Identity - Admin only */}
        {isAdmin && (
          <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
              <CardTitle className="text-[15px] font-bold flex items-center gap-3">
                <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/20">
                  <FiGlobe className="w-5 h-5 text-brand-500" />
                </div>
                System Identity (Logo)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1">
                  <h4 className="text-[14px] font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Branding Assets</h4>
                  <p className="text-[12px] text-gray-500 dark:text-zinc-500 mt-1">Uploaded image will appear in the navigation bar and authentication screens.</p>
                </div>
                <div className="md:col-span-2">
                  <div
                    className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer group ${isDragOver
                        ? 'border-brand-500 bg-brand-500/5 shadow-inner'
                        : 'border-gray-200 dark:border-gray-800 hover:border-brand-500/50 hover:bg-brand-500/[0.02]'
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleChooseFileClick}
                  >
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    {logoPreview ? (
                      <div className="relative inline-block animate-in zoom-in-95 duration-200">
                        <div className="p-4 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 ring-4 ring-brand-500/5">
                          <img src={resolvedLogoPreview} alt="Logo preview" className="max-h-40 mx-auto rounded-xl" />
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveLogo(); }} className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2.5 shadow-xl hover:bg-red-600 hover:scale-110 active:scale-95 transition-all">
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-[#252525] p-5 rounded-[1.5rem] border border-gray-200 dark:border-gray-800 group-hover:scale-110 group-hover:border-brand-500/50 group-hover:bg-brand-500/5 transition-all duration-300">
                          <FiUpload className="h-full w-full text-gray-400 group-hover:text-brand-500" />
                        </div>
                        <p className="text-[14px] text-gray-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto">Drag images directly or click to browse system files</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-8 mt-8 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleSaveAppearance}
                  disabled={!logoFile || savingAppearance}
                  className="relative group overflow-hidden rounded-xl bg-brand-500 px-12 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
                >
                  <span className="relative z-10">{savingAppearance ? 'Uploading…' : 'Sync Visual Branding'}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interface Preferences - Available to all */}
        <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
            <CardTitle className="text-[15px] font-bold flex items-center gap-3">
              <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/20">
                <FiDroplet className="w-5 h-5 text-brand-500" />
              </div>
              Visual Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <h4 className="text-[14px] font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Theme Preference</h4>
                <p className="text-[12px] text-gray-500 dark:text-zinc-500 mt-1">Choose between light and dark interface appearance.</p>
              </div>
              <div className="md:col-span-2">
                <div className="max-w-sm">
                  <select value={isDark ? 'dark' : 'light'} onChange={handleThemeChange} className={inputClasses}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>
            <hr className="border-gray-100 dark:border-gray-800" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <h4 className="text-[14px] font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Interface Language</h4>
                <p className="text-[12px] text-gray-500 dark:text-zinc-500 mt-1">Select your preferred language for the system interface.</p>
              </div>
              <div className="md:col-span-2">
                <div className="max-w-sm">
                  <select className={inputClasses} value={interfaceLanguage} onChange={(e) => setInterfaceLanguage(e.target.value)} disabled={loadingSettings || (isAdmin && savingGeneral)}>
                    <option>English - North America</option>
                    <option>Filipino - PH</option>
                  </select>
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="flex justify-end pt-4">
                <button onClick={() => handleSaveGeneral()} disabled={loadingSettings || savingGeneral} className="text-[13px] font-bold text-brand-500 hover:text-brand-600 transition-colors uppercase tracking-widest">
                  Save Language Setting
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettings;