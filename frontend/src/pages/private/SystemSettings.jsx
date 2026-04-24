import { useEffect, useMemo, useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { systemSettingsAPI } from '../../services/api';
import axios from 'axios';
import {
  FiUsers, FiDatabase, FiShield, FiHardDrive, FiUpload, FiPlus,
  FiSettings, FiMail, FiBell, FiLock, FiDroplet, FiGlobe, FiX,
  FiActivity, FiCheck, FiLayout, FiMonitor, FiSearch, FiSun, FiMoon
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

const SystemSettings = () => {
  const { theme, toggleTheme, isDark, refreshBranding } = useTheme();
  const { user, loading: authLoading } = useAuth();

  const isAdmin = user?.role === 'admin';
  const allowedTabs = isAdmin
    ? ['General', 'Notifications', 'Security', 'Appearance']
    : ['Appearance'];

  const [activeTab, setActiveTab] = useState(0);

  // General settings state
  const [systemTitle, setSystemTitle] = useState('');
  const [institutionName, setInstitutionName] = useState('College of Computing Studies');
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
  const [saveError, setSaveError] = useState(null);

  const [notificationSettings, setNotificationSettings] = useState([
    { id: 1, title: 'Email Notifications', description: 'Receive email notifications for important updates', enabled: true },
    { id: 2, title: 'Push Notifications', description: 'Receive push notifications on your device', enabled: false },
    { id: 3, title: 'SMS Alerts', description: 'Get SMS alerts for critical system events', enabled: true },
    { id: 4, title: 'Weekly Reports', description: 'Receive weekly summary reports via email', enabled: false },
    { id: 5, title: 'Security Alerts', description: 'Get notified about security-related activities', enabled: true },
    { id: 6, title: 'Maintenance Updates', description: 'Receive notifications about system maintenance', enabled: false },
  ]);

  const [securitySettings, setSecuritySettings] = useState([
    { id: 1, title: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account', status: 'Enabled' },
    { id: 2, title: 'Session Timeout', description: 'Automatically log out after period of inactivity', status: '30 mins' },
    { id: 3, title: 'Password Policy', description: 'Enforce strong password requirements', status: 'Strong' },
    { id: 4, title: 'Login Attempts', description: 'Maximum failed login attempts before lockout', status: '5 max' },
  ]);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const toggleNotification = (id) => {
    setNotificationSettings(notificationSettings.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

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

  const inputClasses = "w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-[14px]";
  const labelClasses = "block text-[12px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1";

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
        setSystemTitle(settings?.systemTitle || '');
        setInstitutionName('College of Computing Studies');
        setInterfaceLanguage(settings?.interfaceLanguage || 'English - North America');
        setAcademicYear(settings?.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
        setSemester(settings?.semester || '1st Semester');
        setStoredLogoUrl(settings?.logoUrl || null);
      } catch (err) {
        if (!axios.isCancel(err)) console.error('Failed to load settings:', err);
      } finally {
        if (!controller.signal.aborted) setLoadingSettings(false);
      }
    };
    loadSettings();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (activeTab >= allowedTabs.length) setActiveTab(0);
  }, [allowedTabs.length, activeTab]);

  const handleSaveGeneral = async () => {
    if (!isAdmin) return;
    setSaveError(null);
    setSavingGeneral(true);
    try {
      const settings = await systemSettingsAPI.update({
        systemTitle,
        institutionName: 'College of Computing Studies',
        interfaceLanguage,
        academicYear,
        semester,
      });
      setSystemTitle(settings?.systemTitle || '');
      setInstitutionName('College of Computing Studies');
      setInterfaceLanguage(settings?.interfaceLanguage || 'English - North America');
      setAcademicYear(settings?.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
      setSemester(settings?.semester || '1st Semester');
      setStoredLogoUrl(settings?.logoUrl || null);
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
        systemTitle,
        institutionName,
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {isAdmin ? 'System Configuration' : 'Appearance Preferences'}
          </h1>
        </div>
      </div>

      <TabNavigation
        tabs={allowedTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="space-y-10">
        {saveError && (
          <div className="mb-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {saveError}
          </div>
        )}

        {/* General Tab (Admin only) */}
        {isAdmin && activeTab === 0 && (
          <div className="space-y-10">
            <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
                <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                  <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/20">
                    <FiSettings className="w-5 h-5 text-brand-500" />
                  </div>
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className={labelClasses}>System Title</label>
                    <input type="text" className={inputClasses} value={systemTitle} onChange={(e) => setSystemTitle(e.target.value)} disabled={loadingSettings || savingGeneral} />
                  </div>
                  <div className="space-y-2 opacity-80">
                    <label className={labelClasses}>Institution Name</label>
                    <input 
                      type="text" 
                      className={inputClasses} 
                      value="College of Computing Studies" 
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
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
                  <div className="space-y-2">
                    <label className={labelClasses}>Active Semester</label>
                    <select 
                      className={inputClasses} 
                      value={semester} 
                      onChange={(e) => setSemester(e.target.value)} 
                      disabled={loadingSettings || savingGeneral}
                    >
                      <option>1st Semester</option>
                      <option>2nd Semester</option>
                      <option>Summer Term</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>Interface Language</label>
                    <select className={inputClasses} value={interfaceLanguage} onChange={(e) => setInterfaceLanguage(e.target.value)} disabled={loadingSettings || savingGeneral}>
                      <option>English - North America</option>
                      <option>Filipino - PH</option>
                    </select>
                  </div>
                </div>
                <div className="mt-10 flex justify-end">
                  <button onClick={handleSaveGeneral} disabled={loadingSettings || savingGeneral} className="relative group overflow-hidden rounded-xl bg-brand-500 px-8 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                    <span className="relative z-10">{savingGeneral ? 'Saving…' : 'Save General Settings'}</span>
                    <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
                <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                    <FiMail className="w-5 h-5 text-blue-500" />
                  </div>
                  Email Gateway (SMTP)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className={labelClasses}>SMTP Hostname</label><input type="text" className={inputClasses} placeholder="smtp.gmail.com" /></div>
                  <div className="space-y-2"><label className={labelClasses}>Port protocol</label><input type="text" className={inputClasses} placeholder="587" /></div>
                  <div className="space-y-2"><label className={labelClasses}>Outgoing Address</label><input type="email" className={inputClasses} placeholder="noreply@ccs.edu" /></div>
                  <div className="space-y-2"><label className={labelClasses}>Sender Identifier</label><input type="text" className={inputClasses} placeholder="CCS Profiling System Administrator" /></div>
                </div>
                <div className="mt-10 flex justify-end gap-3">
                  <button className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-[#252525] shadow-sm transition-all">Validate Connection</button>
                  <button className="relative group overflow-hidden rounded-xl bg-brand-500 px-8 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                    <span className="relative z-10">Save Gateway Settings</span>
                    <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab (Admin only) */}
        {isAdmin && activeTab === 1 && (
          <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
              <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                <div className="bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20">
                  <FiBell className="w-5 h-5 text-yellow-500" />
                </div>
                Push & Email notification matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="p-8 flex items-center justify-between hover:bg-gray-50/30 dark:hover:bg-[#252525]/30 transition-all group">
                    <div className="max-w-[80%]">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-[16px] text-gray-900 dark:text-white">{setting.title}</h3>
                        {setting.enabled && <FiCheck className="w-4 h-4 text-green-500" />}
                      </div>
                      <p className="text-[14px] text-gray-500 dark:text-zinc-500 mt-1">{setting.description}</p>
                    </div>
                    <button onClick={() => toggleNotification(setting.id)} className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all ${setting.enabled ? 'bg-brand-500' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                      <span className={`${setting.enabled ? 'translate-x-7' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-8 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button className="relative group overflow-hidden rounded-xl bg-brand-500 px-10 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2">
                  <span className="relative z-10">Save Matrix Changes</span>
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Tab (Admin only) */}
        {isAdmin && activeTab === 2 && (
          <div className="space-y-10">
            <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
                <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                  <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
                    <FiShield className="w-5 h-5 text-orange-500" />
                  </div>
                  Cybersecurity compliance & policies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {securitySettings.map((setting) => (
                    <div key={setting.id} className="p-8 flex items-center justify-between hover:bg-gray-50/30 dark:hover:bg-[#252525]/30 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                          <FiLock className="w-4 h-4 text-gray-400 dark:text-zinc-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[16px] text-gray-900 dark:text-white">{setting.title}</h3>
                          <p className="text-[14px] text-gray-500 dark:text-zinc-400 mt-1">{setting.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="h-8 px-4 border border-brand-500/20 bg-brand-500/10 text-brand-500 text-[11px] font-bold uppercase tracking-wider rounded-lg">
                          {setting.status}
                        </Badge>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-[13px] font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-[#252525] shadow-sm transition-all">Configure</button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
                <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                    <FiActivity className="w-5 h-5 text-blue-500" />
                  </div>
                  Credential rotation (Password)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="max-w-md"><div className="space-y-2"><label className={labelClasses}>Current administrative secret</label><input type="password" className={inputClasses} placeholder="••••••••" /></div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className={labelClasses}>New cryptographic password</label><input type="password" className={inputClasses} placeholder="••••••••" /></div>
                  <div className="space-y-2"><label className={labelClasses}>Confirm secret synchronization</label><input type="password" className={inputClasses} placeholder="••••••••" /></div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="relative group overflow-hidden rounded-xl bg-brand-500 px-10 py-2.5 text-sm font-semibold text-white shadow-lg active:scale-95 transition-all flex items-center gap-2">
                    <span className="relative z-10">Synchronize Passwords</span>
                    <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appearance Tab – available to all authenticated users */}
        {(activeTab === (isAdmin ? 3 : 0)) && (
          <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
              <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/20">
                  <FiDroplet className="w-5 h-5 text-brand-500" />
                </div>
                Visual appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              {/* Theme Mode Selection - always visible */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1">
                  <h4 className="text-[15px] font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Theme Preference</h4>
                  <p className="text-[13px] text-gray-500 dark:text-zinc-500 mt-1">
                    Choose between light and dark interface appearance.
                    {!isAdmin && ' Your preference is saved locally on this device.'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <div className="max-w-sm">
                    <select
                      value={isDark ? 'dark' : 'light'}
                      onChange={handleThemeChange}
                      className={inputClasses}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Logo Upload Section – Admin only */}
              {isAdmin && (
                <>
                  <hr className="border-gray-100 dark:border-gray-800" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-1">
                      <h4 className="text-[15px] font-bold text-gray-900 dark:text-zinc-100 tracking-tight">System Identity (Logo)</h4>
                      <p className="text-[13px] text-gray-500 dark:text-zinc-500 mt-1">Uploaded image will appear in the navigation bar and authentication screens.</p>
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
                            <div className="mt-4 flex items-center justify-center gap-2">
                              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] py-1">READY FOR SYNC</Badge>
                              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{logoFile?.name.split('.').pop()} FILE</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-[#252525] p-5 rounded-[1.5rem] border border-gray-200 dark:border-gray-800 group-hover:scale-110 group-hover:border-brand-500/50 group-hover:bg-brand-500/5 transition-all duration-300">
                              <FiGlobe className="h-full w-full text-gray-400 group-hover:text-brand-500" />
                            </div>
                            <div>
                              <p className="font-bold text-[17px] text-gray-900 dark:text-zinc-100 tracking-tight">Synchronize Brand Identity</p>
                              <p className="text-[14px] text-gray-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto">Drag images directly into this interface or click to browse system files</p>
                            </div>
                            <button className="mt-2 flex items-center gap-2 px-10 py-2 bg-white dark:bg-[#1E1E1E] border border-brand-500/20 text-sm font-medium text-brand-500 hover:bg-brand-500/10 rounded-xl shadow-sm transition-all">System Browse</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-8 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={handleSaveAppearance}
                      disabled={!logoFile || savingAppearance}
                      className="relative group overflow-hidden rounded-xl bg-brand-500 px-12 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <span className="relative z-10">{savingAppearance ? 'Uploading…' : 'Synchronize Visual Branding'}</span>
                      <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
                    </button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;