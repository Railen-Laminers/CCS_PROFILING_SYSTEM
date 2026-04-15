import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiSave, FiX, FiLoader, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { authAPI } from '@/services/api';
import { useTheme } from '@/contexts/ThemeContext';

const UsersIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const predefinedOrganizations = [
  'Student Council', 'Student Government', 'Supreme Student Council',
  'IT Club', 'Programming Club', 'Robotics Club', 'Science Club', 'Math Club',
  'Literary Club', 'Writing Club', 'Journalism Club', 'Debate Team',
  'Art Club', 'Music Club', 'Choir', 'Dance Club', 'Drama Club',
  'Basketball Team', 'Volleyball Team', 'Football Team', 'Swimming Team',
  'Track and Field', 'Badminton Club', 'Table Tennis Club',
  'Scout Club', 'Red Cross Youth', 'Eco Warriors', 'Community Service',
  'Rotaract Club', 'Leo Club', 'Interact Club'
];

// Convert backend structure to local array of entries
const backendToLocal = (backendData) => {
  if (!backendData || typeof backendData !== 'object') return [];
  const entries = [];

  // Clubs -> entries with name = club, no position/role
  if (Array.isArray(backendData.clubs)) {
    backendData.clubs.forEach(club => {
      entries.push({ name: club, position: '', role: '', years: '' });
    });
  }

  // Student Council positions -> entries with name = "Student Council", position = position, role = "Student Council"
  if (Array.isArray(backendData.studentCouncil)) {
    backendData.studentCouncil.forEach(pos => {
      entries.push({ name: 'Student Council', position: pos, role: 'Student Council', years: '' });
    });
  }

  // Leadership roles -> entries with name = role (or generic "Leadership"), role = role
  if (Array.isArray(backendData.roles)) {
    backendData.roles.forEach(role => {
      entries.push({ name: role, position: '', role: role, years: '' });
    });
  }

  return entries;
};

// Convert local array of entries to backend structure
const localToBackend = (entries) => {
  const clubs = [];
  const studentCouncil = [];
  const roles = [];

  entries.forEach(entry => {
    const name = entry.name?.trim();
    const position = entry.position?.trim();
    const role = entry.role?.trim();

    if (name && name.toLowerCase() === 'student council') {
      if (position) studentCouncil.push(position);
      else if (role) studentCouncil.push(role);
    } else if (role && role.toLowerCase() === 'student council') {
      if (position) studentCouncil.push(position);
      else if (name) studentCouncil.push(name);
    } else if (name) {
      clubs.push(name);
    }

    if (role && role.toLowerCase() !== 'student council' && role !== '') {
      roles.push(role);
    }
  });

  return {
    clubs: [...new Set(clubs)],
    studentCouncil: [...new Set(studentCouncil)],
    roles: [...new Set(roles)]
  };
};

// Helper to render tags (same as admin page)
const renderTags = (data, field) => {
  if (!data) return <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>;
  let items = [];
  if (field === 'clubs') items = data.clubs || [];
  else if (field === 'studentCouncil') items = data.studentCouncil || [];
  else if (field === 'roles') items = data.roles || [];
  else return <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>;

  if (items.length === 0) return <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>;

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {items.map((item, idx) => (
        <span key={idx} className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
          {item}
        </span>
      ))}
    </div>
  );
};

const OrganizationsForm = ({ onCancel, onBack }) => {
  const { user: currentUser, refreshUser } = useAuth();
  const { showToast } = useToast();
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Local entries (array of objects with name, position, years, role)
  const [entries, setEntries] = useState([]);
  const [entryForm, setEntryForm] = useState({ name: '', position: '', years: '', role: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const [customOrg, setCustomOrg] = useState('');

  // Backup for cancel
  const [originalEntries, setOriginalEntries] = useState([]);

  // Load existing data
  useEffect(() => {
    if (currentUser && currentUser.student) {
      const rawOrgs = currentUser.student.organizations;
      const localEntries = backendToLocal(rawOrgs);
      setEntries(localEntries);
      setOriginalEntries(JSON.parse(JSON.stringify(localEntries)));
      setLoading(false);
    } else if (currentUser === null) {
      setLoading(false);
    } else if (currentUser && !currentUser.student) {
      showToast('Student profile not found', 'error');
      setLoading(false);
    }
  }, [currentUser, showToast]);

  const filteredOrgs = predefinedOrganizations.filter(org =>
    org.toLowerCase().includes(customOrg.toLowerCase())
  );

  const addEntry = () => {
    if (entryForm.name || entryForm.position || entryForm.role) {
      setEntries([...entries, { ...entryForm }]);
      setEntryForm({ name: '', position: '', years: '', role: '' });
      setCustomOrg('');
      setShowDropdown(false);
    } else {
      showToast('Please fill at least organization name or position', 'warning');
    }
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const selectOrganization = (orgName) => {
    setEntryForm({ ...entryForm, name: orgName });
    setShowDropdown(false);
    setCustomOrg('');
  };

  const handleEdit = () => {
    setOriginalEntries(JSON.parse(JSON.stringify(entries)));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEntries(JSON.parse(JSON.stringify(originalEntries)));
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const backendData = localToBackend(entries);
      const payload = { organizations: backendData };

      await authAPI.updateProfile(payload);
      showToast('Organizations updated successfully!', 'success');
      await refreshUser();

      setOriginalEntries(JSON.parse(JSON.stringify(entries)));
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to update organizations';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Input class WITH border (matching MedicalRecordsForm)
  const inputClass = `w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-gray-50 dark:bg-[#18181B] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`;

  // Read‑only display container with border
  const readOnlyContainerClass = `w-full p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700 min-h-[42px] text-gray-900 dark:text-white text-sm`;

  const labelClass = `text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300`;

  // Read‑only display using the same style as the admin page
  const renderReadOnly = () => {
    const backendData = localToBackend(entries);
    if (!backendData.clubs.length && !backendData.studentCouncil.length && !backendData.roles.length) {
      return (
        <div className={readOnlyContainerClass}>
          <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
        </div>
      );
    }

    return (
      <div className={`space-y-6 ${readOnlyContainerClass}`}>
        {/* Clubs */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Clubs Joined</h4>
          {renderTags(backendData, 'clubs')}
        </div>
        {/* Student Council */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Student Council</h4>
          {renderTags(backendData, 'studentCouncil')}
        </div>
        {/* Leadership Roles */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Leadership Roles</h4>
          {renderTags(backendData, 'roles')}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <FiLoader className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <button
        onClick={onBack}
        className={`flex items-center text-sm font-medium mb-6 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
      >
        <FiArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className={`max-w-4xl mx-auto rounded-xl shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        <div className="p-8">
          <div className={`flex items-center gap-2 mb-6 pb-2 ${isDark ? 'border-gray-700' : 'border-gray-50'}`}>
            <UsersIcon className="w-5 h-5 text-orange-500" />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Organizations & Leadership</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isEditing ? (
              <>
                {/* Add New Entry - Dashed Container */}
                <div className={`border-2 border-dashed rounded-lg p-6 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <label className={labelClass}>Add Organization / Leadership</label>

                  <div className="mb-4 relative">
                    <label className={`${labelClass} text-xs font-semibold`}>Organization Name *</label>
                    <input
                      type="text"
                      value={entryForm.name || customOrg}
                      onChange={(e) => {
                        setCustomOrg(e.target.value);
                        setEntryForm({ ...entryForm, name: '' });
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className={inputClass}
                      placeholder="Select or type organization"
                    />
                    {showDropdown && (filteredOrgs.length > 0 || customOrg) && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {customOrg && !predefinedOrganizations.some(o => o.toLowerCase() === customOrg.toLowerCase()) && (
                          <button
                            type="button"
                            onClick={() => selectOrganization(customOrg)}
                            className="w-full text-left px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 border-b dark:border-gray-700"
                          >
                            + Add "{customOrg}"
                          </button>
                        )}
                        {filteredOrgs.map((org, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectOrganization(org)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {org}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Position (e.g., Member, Officer)</label>
                      <input
                        type="text"
                        value={entryForm.position}
                        onChange={(e) => setEntryForm({ ...entryForm, position: e.target.value })}
                        className={inputClass}
                        placeholder="e.g., Member, Officer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Years Active</label>
                      <input
                        type="text"
                        value={entryForm.years}
                        onChange={(e) => setEntryForm({ ...entryForm, years: e.target.value })}
                        className={inputClass}
                        placeholder="e.g., 2024-2026"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Leadership Role (Optional)</label>
                    <input
                      type="text"
                      value={entryForm.role}
                      onChange={(e) => setEntryForm({ ...entryForm, role: e.target.value })}
                      className={inputClass}
                      placeholder="e.g., President, Vice President"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addEntry}
                    className="w-full py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
                  >
                    <FiPlus className="w-4 h-4 text-orange-500" />
                    Add Entry
                  </button>
                </div>

                {/* Current Entries List */}
                {entries.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Your Organizations & Roles:</p>
                    {entries.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{entry.name || entry.position || entry.role || 'Unnamed'}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {entry.position && (
                              <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">
                                {entry.position}
                              </span>
                            )}
                            {entry.role && (
                              <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-1 rounded">
                                {entry.role}
                              </span>
                            )}
                            {entry.years && (
                              <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded">
                                {entry.years}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEntry(index)}
                          className="text-red-500 hover:text-red-700 ml-4"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <FiX className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-70"
                  >
                    {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            ) : (
              // Read‑only view with border
              <>
                <div className="space-y-1">
                  <label className={labelClass}>Organizations & Leadership</label>
                  {renderReadOnly()}
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="px-6 py-2.5 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors flex items-center gap-2"
                  >
                    <FiEdit2 className="w-4 h-4" /> Edit Organizations
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationsForm;