import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiSave } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

const UsersIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
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

const OrganizationsForm = ({ onCancel, onBack }) => {
  const { isDark } = useTheme();
  const [organizations, setOrganizations] = useState([]);
  const [orgForm, setOrgForm] = useState({ name: '', position: '', years: '', role: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const [customOrg, setCustomOrg] = useState('');

  const filteredOrgs = predefinedOrganizations.filter(org => 
    org.toLowerCase().includes(customOrg.toLowerCase())
  );

  const addOrganization = () => {
    if (orgForm.name || orgForm.position) {
      setOrganizations([...organizations, { ...orgForm }]);
      setOrgForm({ name: '', position: '', years: '', role: '' });
      setCustomOrg('');
    }
  };

  const removeOrganization = (index) => {
    setOrganizations(organizations.filter((_, i) => i !== index));
  };

  const selectOrganization = (orgName) => {
    setOrgForm({ ...orgForm, name: orgName });
    setShowDropdown(false);
    setCustomOrg('');
  };

  const inputClass = `w-full p-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`;
  const labelClass = `text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`;
  const subLabelClass = `text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { organizations };
    console.log('Form submitted:', formData);
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Back to Dashboard Link */}
      <button 
        onClick={onBack}
        className={`flex items-center text-sm font-medium mb-6 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
      >
        <FiArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      {/* Main Card */}
      <div className={`max-w-4xl mx-auto rounded-xl shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        <div className="p-8">
          {/* Header */}
          <div className={`flex items-center gap-2 mb-6 pb-2 ${isDark ? 'border-gray-700' : 'border-gray-50'}`}>
            <UsersIcon className="w-5 h-5 text-orange-500" />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Organizations & Leadership</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Add New Organization - Dashed Container */}
            <div className={`border-2 border-dashed rounded-lg p-6 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              <label className={labelClass}>Add New Organization</label>

              {/* Organization Name - ComboBox */}
              <div className="mb-4 relative">
                <label className={subLabelClass}>Organization Name *</label>
                <input 
                  type="text" 
                  value={orgForm.name || customOrg}
                  onChange={(e) => {
                    setCustomOrg(e.target.value);
                    setOrgForm({ ...orgForm, name: '' });
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className={inputClass}
                  placeholder="Select or type organization"
                />
                {showDropdown && (filteredOrgs.length > 0 || customOrg) && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {customOrg && !predefinedOrganizations.some(o => o.toLowerCase() === customOrg.toLowerCase()) && (
                      <button
                        type="button"
                        onClick={() => selectOrganization(customOrg)}
                        className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 border-b"
                      >
                        + Add "{customOrg}"
                      </button>
                    )}
                    {filteredOrgs.map((org, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectOrganization(org)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {org}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Position & Years Active - 2 Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                  <input 
                    type="text" 
                    value={orgForm.position}
                    onChange={(e) => setOrgForm({...orgForm, position: e.target.value})}
                    className={inputClass}
                    placeholder="e.g., Member, Officer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Years Active</label>
                  <input 
                    type="text" 
                    value={orgForm.years}
                    onChange={(e) => setOrgForm({...orgForm, years: e.target.value})}
                    className={inputClass}
                    placeholder="e.g., 2024-2026"
                  />
                </div>
              </div>

              {/* Leadership Role - Full Width */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Leadership Role (Optional)</label>
                <input 
                  type="text" 
                  value={orgForm.role}
                  onChange={(e) => setOrgForm({...orgForm, role: e.target.value})}
                  className={inputClass}
                  placeholder="e.g., President, Vice President, Committee Head"
                />
              </div>

              {/* Add Organization Button */}
              <button 
                type="button"
                onClick={addOrganization}
                className="w-full py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <FiPlus className="w-4 h-4 text-orange-500" />
                Add Organization
              </button>
            </div>

            {/* Added Organizations List */}
            {organizations.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-800">Added Organizations:</p>
                {organizations.map((org, index) => (
                  <div 
                    key={index}
                    className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{org.name || org.position}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {org.position && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {org.position}
                          </span>
                        )}
                        {org.years && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {org.years}
                          </span>
                        )}
                        {org.role && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            {org.role}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOrganization(index)}
                      className="text-red-500 hover:text-red-700 text-sm ml-4"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button 
                type="button" 
                onClick={onCancel}
                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationsForm;