import { useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiUsers, 
  FiDatabase, 
  FiShield, 
  FiHardDrive,
  FiUpload,
  FiPlus,
  FiSettings,
  FiMail,
  FiBell,
  FiLock,
  FiDroplet,
  FiGlobe,
  FiX,
  FiActivity
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const SystemSettings = () => {
  const { primaryColor, updatePrimaryColor } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
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

  const tabs = ['General', 'User Management', 'Notifications', 'Security', 'Appearance'];

  const statCards = [
    { label: 'Total Users', icon: FiUsers, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Storage Used', icon: FiDatabase, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Active Sessions', icon: FiShield, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: 'Last Backup', icon: FiHardDrive, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  const toggleNotification = (id) => {
    setNotificationSettings(notificationSettings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const handleColorChange = (e) => {
    updatePrimaryColor(e.target.value);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    setLogoFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const inputClasses = "w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white";
  const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">System Settings</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Configure system preferences and settings</p>
        </div>
        <Button className="gap-2">
          <FiUpload className="h-5 w-5" />
          <span>Backup System</span>
        </Button>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <Card key={index} className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 mt-1">{card.label}</p>
                </div>
                <div className={`${card.bgColor} dark:bg-opacity-10 p-3 rounded-xl`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-100/50 dark:bg-zinc-900/50 p-1.5 rounded-xl flex gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`flex-1 min-w-fit px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === index
                ? 'bg-white dark:bg-zinc-800 text-brand-500 shadow-sm'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {activeTab === 0 && (
          <div className="space-y-6">
            <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiSettings className="w-5 h-5 text-brand-500" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>System Name</label>
                    <input type="text" className={inputClasses} placeholder="CCS Profiling System" />
                  </div>
                  <div>
                    <label className={labelClasses}>Institution Name</label>
                    <input type="text" className={inputClasses} placeholder="College of Computer Studies" />
                  </div>
                  <div>
                    <label className={labelClasses}>Academic Year</label>
                    <input type="text" className={inputClasses} placeholder="2023-2024" />
                  </div>
                  <div>
                    <label className={labelClasses}>Current Semester</label>
                    <input type="text" className={inputClasses} placeholder="1st Semester" />
                  </div>
                  <div>
                    <label className={labelClasses}>Time Zone</label>
                    <select className={inputClasses}>
                      <option>(GMT+08:00) Manila</option>
                      <option>(GMT+00:00) UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Language</label>
                    <select className={inputClasses}>
                      <option>English (US)</option>
                      <option>Filipino</option>
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button>Save General Settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiMail className="w-5 h-5 text-blue-500" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>SMTP Server</label>
                    <input type="text" className={inputClasses} placeholder="smtp.gmail.com" />
                  </div>
                  <div>
                    <label className={labelClasses}>SMTP Port</label>
                    <input type="text" className={inputClasses} placeholder="587" />
                  </div>
                  <div>
                    <label className={labelClasses}>From Email</label>
                    <input type="email" className={inputClasses} placeholder="noreply@ccs.edu" />
                  </div>
                  <div>
                    <label className={labelClasses}>From Name</label>
                    <input type="text" className={inputClasses} placeholder="System Admin" />
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                  <Button variant="secondary">Test Connection</Button>
                  <Button>Save Email Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 1 && (
          <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg flex items-center gap-2">
                <FiUsers className="w-5 h-5 text-brand-500" />
                User Management
              </CardTitle>
              <Button size="sm" className="gap-2">
                <FiPlus className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Name</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Role</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-brand-500/5 dark:hover:bg-brand-500/10">
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-zinc-500">
                        <div className="flex flex-col items-center gap-2">
                           <div className="bg-gray-100 dark:bg-zinc-800/50 p-4 rounded-full">
                             <FiUsers className="h-8 w-8 text-gray-300 dark:text-zinc-600" />
                           </div>
                           <p className="font-semibold text-lg dark:text-zinc-300">No users found</p>
                           <p className="text-sm">Manage system administrators and staff</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg flex items-center gap-2">
                <FiBell className="w-5 h-5 text-brand-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <div className="max-w-[80%]">
                      <h3 className="font-bold text-gray-900 dark:text-white">{setting.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{setting.description}</p>
                    </div>
                    <button
                      onClick={() => toggleNotification(setting.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        setting.enabled ? 'bg-brand-500' : 'bg-gray-200 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`${
                          setting.enabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-6 flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <div className="space-y-6">
            <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiLock className="w-5 h-5 text-orange-500" />
                  Security Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {securitySettings.map((setting) => (
                    <div key={setting.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{setting.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{setting.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="px-3 py-1 bg-brand-500/10 text-brand-500 rounded-lg text-xs font-bold uppercase tracking-wider underline underline-offset-4 decoration-2">
                           {setting.status}
                         </span>
                         <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiActivity className="w-5 h-5 text-blue-500" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className={labelClasses}>Current Password</label>
                  <input type="password" className={inputClasses} placeholder="••••••••" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>New Password</label>
                    <input type="password" className={inputClasses} placeholder="••••••••" />
                  </div>
                  <div>
                    <label className={labelClasses}>Confirm New Password</label>
                    <input type="password" className={inputClasses} placeholder="••••••••" />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 4 && (
          <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg flex items-center gap-2">
                <FiDroplet className="w-5 h-5 text-brand-500" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {/* Primary Color */}
              <div>
                <label className={labelClasses}>Primary Brand Color</label>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl border-2 border-white dark:border-gray-800 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => document.getElementById('color-picker').click()}
                  />
                  <input
                    type="color"
                    id="color-picker"
                    value={primaryColor}
                    onChange={handleColorChange}
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={handleColorChange}
                    className={`${inputClasses} flex-1 font-mono uppercase`}
                    placeholder="#F97316"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className={labelClasses}>System Logo</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer group ${
                    isDragOver 
                      ? 'border-brand-500 bg-brand-500/5' 
                      : 'border-gray-200 dark:border-gray-800 hover:border-brand-500/50 hover:bg-brand-500/5'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleChooseFileClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="max-h-32 mx-auto rounded-lg"
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveLogo(); }}
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-2xl group-hover:bg-brand-500/10 transition-colors">
                        <FiGlobe className="h-8 w-8 text-gray-400 group-hover:text-brand-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">PNG, JPG, SVG up to 5MB</p>
                      </div>
                      <Button variant="secondary" size="sm" className="mt-2">Choose File</Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button>Save Appearance</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;
