import React, { useState, useEffect } from 'react';
import { FiPlus, FiSave, FiX, FiLoader, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { authAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const UsersIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

// Consistent styling from Profile page
const labelClasses = 'block text-[12px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1';
const inputClasses = (error, touched, value) => {
  const hasError = error && touched;
  const isValid = touched && !error && value && value.toString().trim() !== '';
  return `w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] text-gray-900 dark:text-white border ${hasError
    ? 'border-red-500 ring-red-500/10'
    : isValid
      ? 'border-green-500/40 dark:border-green-500/30 bg-green-500/[0.02]'
      : 'border-gray-200 dark:border-gray-800'
    } rounded-xl focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 text-[14px]`;
};

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

  if (Array.isArray(backendData.clubs)) {
    backendData.clubs.forEach(club => {
      entries.push({ name: club, position: '', role: '', years: '' });
    });
  }

  if (Array.isArray(backendData.studentCouncil)) {
    backendData.studentCouncil.forEach(pos => {
      entries.push({ name: 'Student Council', position: pos, role: 'Student Council', years: '' });
    });
  }

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

// Helper to render tags
const renderTags = (data, field) => {
  if (!data) return <span className="text-gray-500 dark:text-gray-400 text-sm">—</span>;
  let items = [];
  if (field === 'clubs') items = data.clubs || [];
  else if (field === 'studentCouncil') items = data.studentCouncil || [];
  else if (field === 'roles') items = data.roles || [];
  else return <span className="text-gray-500 dark:text-gray-400 text-sm">—</span>;

  if (items.length === 0) return <span className="text-gray-500 dark:text-gray-400 text-sm">—</span>;

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

const OrganizationsForm = () => {
  const { user: currentUser, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [entries, setEntries] = useState([]);
  const [entryForm, setEntryForm] = useState({ name: '', position: '', years: '', role: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const [customOrg, setCustomOrg] = useState('');
  const [originalEntries, setOriginalEntries] = useState([]);

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

  // Read-only display
  const renderReadOnly = () => {
    const backendData = localToBackend(entries);
    if (!backendData.clubs.length && !backendData.studentCouncil.length && !backendData.roles.length) {
      return (
        <div className="w-full min-h-[44px] px-4 py-2 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[14px]">
          <span className="text-gray-500 dark:text-gray-400 text-sm">—</span>
        </div>
      );
    }

    return (
      <div className="w-full px-4 py-3 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl space-y-3">
        {/* Clubs */}
        <div>
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Clubs Joined</h4>
          {renderTags(backendData, 'clubs')}
        </div>
        {/* Student Council */}
        <div>
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Student Council</h4>
          {renderTags(backendData, 'studentCouncil')}
        </div>
        {/* Leadership Roles */}
        <div>
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Leadership Roles</h4>
          {renderTags(backendData, 'roles')}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b00]" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-12">

      <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
          <CardTitle className="text-[16px] font-bold flex items-center gap-3">
            <div className="bg-[#ff6b00]/10 p-2 rounded-lg border border-[#ff6b00]/20">
              <UsersIcon className="w-5 h-5 text-[#ff6b00]" />
            </div>
            Organizations & Leadership
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {isEditing ? (
              <>
                {/* Add New Entry */}
                <div className="space-y-2">
                  <label className={labelClasses}>Add Organization / Leadership</label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
                    {/* Organization Name with dropdown */}
                    <div className="relative">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Organization Name *</label>
                      <input
                        type="text"
                        value={entryForm.name || customOrg}
                        onChange={(e) => {
                          setCustomOrg(e.target.value);
                          setEntryForm({ ...entryForm, name: '' });
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        className={inputClasses(false, false, entryForm.name || customOrg)}
                        placeholder="Select or type organization"
                      />
                      {showDropdown && (filteredOrgs.length > 0 || customOrg) && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Position</label>
                        <input
                          type="text"
                          value={entryForm.position}
                          onChange={(e) => setEntryForm({ ...entryForm, position: e.target.value })}
                          className={inputClasses(false, false, entryForm.position)}
                          placeholder="e.g., Member, Officer"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Years Active</label>
                        <input
                          type="text"
                          value={entryForm.years}
                          onChange={(e) => setEntryForm({ ...entryForm, years: e.target.value })}
                          className={inputClasses(false, false, entryForm.years)}
                          placeholder="e.g., 2024-2026"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Leadership Role</label>
                      <input
                        type="text"
                        value={entryForm.role}
                        onChange={(e) => setEntryForm({ ...entryForm, role: e.target.value })}
                        className={inputClasses(false, false, entryForm.role)}
                        placeholder="e.g., President, Vice President"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addEntry}
                      className="w-full gap-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Entry
                    </Button>
                  </div>
                </div>

                {/* Current Entries List */}
                {entries.length > 0 && (
                  <div className="space-y-2">
                    <label className={labelClasses}>Your Organizations & Roles</label>
                    <div className="space-y-2">
                      {entries.map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 dark:text-gray-100">
                              {entry.name || entry.position || entry.role || 'Unnamed'}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {entry.position && (
                                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                  {entry.position}
                                </span>
                              )}
                              {entry.role && (
                                <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-0.5 rounded-full">
                                  {entry.role}
                                </span>
                              )}
                              {entry.years && (
                                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
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
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancelEdit} className="gap-2">
                    <FiX className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="gap-2 bg-[#ff6b00] hover:bg-orange-600">
                    {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </>
            ) : (
              // Read-only view
              <>
                <div className="space-y-2">
                  <label className={labelClasses}>Organizations & Leadership</label>
                  {renderReadOnly()}
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={handleEdit} className="gap-2 bg-[#ff6b00] hover:bg-orange-600">
                    <FiEdit2 className="w-4 h-4" />
                    Edit Organizations
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationsForm;