import { useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiUsers, 
  FiDatabase, 
  FiShield, 
  FiHardDrive,
  FiSave,
  FiUpload,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSettings,
  FiMail,
  FiBell,
  FiLock,
  FiDroplet,
  FiGlobe,
  FiX
} from 'react-icons/fi';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
          <p className="text-gray-500 mt-1">Configure system preferences and settings</p>
        </div>
        <button 
          className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:brightness-90"
          style={{ backgroundColor: primaryColor }}
        >
          <FiUpload className="h-5 w-5" />
          <span>Backup System</span>
        </button>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800"></p>
                <p className="text-gray-500 mt-1">{card.label}</p>
              </div>
              <div className={`${card.bgColor} rounded-lg p-3`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-2 mb-6 shadow-sm">
        <div className="flex gap-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === index
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === index ? { backgroundColor: primaryColor } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* General Tab Content */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* General Settings Section */}
            <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg p-2" style={{ backgroundColor: `${primaryColor}20` }}>
                  <FiSettings className="h-5 w-5" style={{ color: primaryColor }} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  className="text-white px-6 py-2 rounded-lg transition-colors hover:brightness-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Email Configuration Section */}
            <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 rounded-lg p-2">
                  <FiMail className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Email Configuration</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-start gap-3">
                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg transition-colors">
                  Test Connection
                </button>
                <button 
                  className="text-white px-6 py-2 rounded-lg transition-colors hover:brightness-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab Content */}
        {activeTab === 1 && (
          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
              <button 
                className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:brightness-90"
                style={{ backgroundColor: primaryColor }}
              >
                <FiPlus className="h-4 w-4" />
                <span>Add New User</span>
              </button>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Login</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <FiUsers className="h-12 w-12 text-gray-300" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">Add your first user to get started</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notifications Tab Content */}
        {activeTab === 2 && (
          <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg p-2" style={{ backgroundColor: `${primaryColor}20` }}>
                <FiBell className="h-5 w-5" style={{ color: primaryColor }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              {notificationSettings.map((setting, index) => (
                <div 
                  key={setting.id} 
                  className={`flex items-center justify-between py-4 ${index !== notificationSettings.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{setting.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(setting.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      setting.enabled
                        ? 'text-white hover:brightness-90'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    style={setting.enabled ? { backgroundColor: primaryColor } : {}}
                  >
                    {setting.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab Content */}
        {activeTab === 3 && (
          <div className="space-y-6">
            {/* Security Settings Overview */}
            <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg p-2" style={{ backgroundColor: `${primaryColor}20` }}>
                  <FiLock className="h-5 w-5" style={{ color: primaryColor }} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>
              </div>
              <div className="space-y-4">
                {securitySettings.map((setting, index) => (
                  <div 
                    key={setting.id} 
                    className={`flex items-center justify-between py-4 ${index !== securitySettings.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">{setting.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        className="px-3 py-1 text-white rounded-lg text-sm font-medium hover:brightness-90 transition-colors"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {setting.status}
                      </button>
                      <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                </div>
              </div>
              <div className="mt-6">
                <button 
                  className="text-white px-6 py-2 rounded-lg transition-colors hover:brightness-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab Content */}
        {activeTab === 4 && (
          <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg p-2" style={{ backgroundColor: `${primaryColor}20` }}>
                <FiDroplet className="h-5 w-5" style={{ color: primaryColor }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Theme Customization</h2>
            </div>

            {/* Primary Color Picker */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div 
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => document.getElementById('color-picker').click()}
                  />
                  <input
                    type="color"
                    id="color-picker"
                    value={primaryColor}
                    onChange={handleColorChange}
                    className="absolute opacity-0 w-0 h-0"
                  />
                </div>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={handleColorChange}
                  placeholder="#FF8C42"
                  className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': primaryColor }}
                />
              </div>
            </div>

            {/* Logo Upload Dropzone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  isDragOver 
                    ? 'border-orange-400 bg-orange-50' 
                    : 'border-gray-300 hover:border-orange-400'
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
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="max-h-32 max-w-full rounded-lg object-contain"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLogo();
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{logoFile?.name}</p>
                  </div>
                ) : logoFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gray-100 rounded-full p-4">
                      <FiGlobe className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">{logoFile.name}</p>
                      <p className="text-sm text-gray-400 mt-1">Click to change or drag a new file</p>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLogo();
                      }}
                      className="mt-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gray-100 rounded-full p-4">
                      <FiGlobe className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Drop your logo here or click to upload</p>
                      <p className="text-sm text-gray-400 mt-1">PNG, JPG, SVG up to 5MB</p>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChooseFileClick();
                      }}
                      className="mt-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button 
                className="text-white px-6 py-2 rounded-lg transition-colors hover:brightness-90"
                style={{ backgroundColor: primaryColor }}
              >
                Save Appearance
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;
