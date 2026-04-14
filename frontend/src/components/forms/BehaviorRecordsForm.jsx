import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiSave, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

const AlertIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.598 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

const BehaviorRecordsForm = ({ onCancel, onBack }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('warnings');
  const [warnings, setWarnings] = useState([]);
  const [suspensions, setSuspensions] = useState([]);
  const [counseling, setCounseling] = useState([]);
  const [incidents, setIncidents] = useState([]);
  
  const [warningForm, setWarningForm] = useState({ date: '', reason: '' });
  const [suspensionForm, setSuspensionForm] = useState({ date: '', reason: '' });
  const [counselingForm, setCounselingForm] = useState({ date: '', reason: '' });
  const [incidentForm, setIncidentForm] = useState({ date: '', description: '' });

  const tabs = [
    { key: 'warnings', label: 'Warnings' },
    { key: 'suspensions', label: 'Suspensions' },
    { key: 'counseling', label: 'Counseling' },
    { key: 'incidents', label: 'Incidents' }
  ];

  const addWarning = () => {
    if (warningForm.date && warningForm.reason) {
      setWarnings([...warnings, { ...warningForm, id: Date.now() }]);
      setWarningForm({ date: '', reason: '' });
    }
  };

  const removeWarning = (id) => {
    setWarnings(warnings.filter(w => w.id !== id));
  };

  const addSuspension = () => {
    if (suspensionForm.date && suspensionForm.reason) {
      setSuspensions([...suspensions, { ...suspensionForm, id: Date.now() }]);
      setSuspensionForm({ date: '', reason: '' });
    }
  };

  const removeSuspension = (id) => {
    setSuspensions(suspensions.filter(s => s.id !== id));
  };

  const addCounseling = () => {
    if (counselingForm.date && counselingForm.reason) {
      setCounseling([...counseling, { ...counselingForm, id: Date.now() }]);
      setCounselingForm({ date: '', reason: '' });
    }
  };

  const removeCounseling = (id) => {
    setCounseling(counseling.filter(c => c.id !== id));
  };

  const addIncident = () => {
    if (incidentForm.date || incidentForm.description) {
      setIncidents([...incidents, { ...incidentForm, id: Date.now() }]);
      setIncidentForm({ date: '', description: '' });
    }
  };

  const removeIncident = (id) => {
    setIncidents(incidents.filter(i => i.id !== id));
  };

  const getCurrentList = () => {
    switch (activeTab) {
      case 'warnings': return warnings;
      case 'suspensions': return suspensions;
      case 'counseling': return counseling;
      case 'incidents': return incidents;
      default: return [];
    }
  };

  const removeItem = (id) => {
    switch (activeTab) {
      case 'warnings': removeWarning(id); break;
      case 'suspensions': removeSuspension(id); break;
      case 'counseling': removeCounseling(id); break;
      case 'incidents': removeIncident(id); break;
      default: break;
    }
  };

  const getAddButtonLabel = () => {
    switch (activeTab) {
      case 'warnings': return 'Add Warning';
      case 'suspensions': return 'Add Suspension';
      case 'counseling': return 'Add Counseling';
      case 'incidents': return 'Add Incident';
      default: return 'Add';
    }
  };

  const inputClass = `w-full p-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`;
  const labelClass = `text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`;
  const subLabelClass = `text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { warnings, suspensions, counseling, incidents };
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
          <div className={`flex items-center gap-2 mb-8 pb-2 ${isDark ? 'border-gray-700' : 'border-gray-50'}`}>
            <AlertIcon className="w-5 h-5 text-orange-500" />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Behavior & Discipline Records</h2>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-8 mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <FiCheckCircle className={`w-10 h-10 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Clean Record</h3>
            <p className="text-gray-500 text-sm">No behavioral incidents or disciplinary actions recorded</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tabs Navigation */}
            <div className={`rounded-lg p-1 flex ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? `${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} shadow-sm`
                      : `${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input Section - Dashed Container */}
            <div className={`border-2 border-dashed rounded-lg p-6 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              <label className={labelClass}>
                Add {activeTab === 'warnings' ? 'Warning' : 
                      activeTab === 'suspensions' ? 'Suspension' : 
                      activeTab === 'counseling' ? 'Counseling' : 'Incident'}
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={subLabelClass}>Date</label>
                  {activeTab === 'incidents' ? (
                    <input 
                      type="date"
                      value={incidentForm.date}
                      onChange={(e) => setIncidentForm({...incidentForm, date: e.target.value})}
                      className={inputClass}
                    />
                  ) : (
                    <input 
                      type="date"
                      value={activeTab === 'warnings' ? warningForm.date : 
                             activeTab === 'suspensions' ? suspensionForm.date : 
                             counselingForm.date}
                      onChange={(e) => {
                        if (activeTab === 'warnings') setWarningForm({...warningForm, date: e.target.value});
                        else if (activeTab === 'suspensions') setSuspensionForm({...suspensionForm, date: e.target.value});
                        else setCounselingForm({...counselingForm, date: e.target.value});
                      }}
                      className={inputClass}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {activeTab === 'incidents' ? 'Description' : 'Reason'}
                  </label>
                  {activeTab === 'incidents' ? (
                    <input 
                      type="text"
                      value={incidentForm.description}
                      onChange={(e) => setIncidentForm({...incidentForm, description: e.target.value})}
                      placeholder="Enter description"
                      className={inputClass}
                    />
                  ) : (
                    <input 
                      type="text"
                      value={activeTab === 'warnings' ? warningForm.reason : 
                             activeTab === 'suspensions' ? suspensionForm.reason : 
                             counselingForm.reason}
                      onChange={(e) => {
                        if (activeTab === 'warnings') setWarningForm({...warningForm, reason: e.target.value});
                        else if (activeTab === 'suspensions') setSuspensionForm({...suspensionForm, reason: e.target.value});
                        else setCounselingForm({...counselingForm, reason: e.target.value});
                      }}
                      placeholder="Enter reason"
                      className={inputClass}
                    />
                  )}
                </div>
              </div>

              <button 
                type="button"
                onClick={() => {
                  if (activeTab === 'warnings') addWarning();
                  else if (activeTab === 'suspensions') addSuspension();
                  else if (activeTab === 'counseling') addCounseling();
                  else addIncident();
                }}
                className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4 text-orange-500" />
                {getAddButtonLabel()}
              </button>
            </div>

            {/* Added Items List */}
            {getCurrentList().length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-800">
                  Added {activeTab === 'warnings' ? 'Warnings' : 
                         activeTab === 'suspensions' ? 'Suspensions' : 
                         activeTab === 'counseling' ? 'Counseling Sessions' : 'Incidents'}:
                </p>
                {getCurrentList().map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Date:</span> {item.date || item.date || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{activeTab === 'incidents' ? 'Description' : 'Reason'}:</span> {item.reason || item.description || 'N/A'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
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
                Save Records
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BehaviorRecordsForm;