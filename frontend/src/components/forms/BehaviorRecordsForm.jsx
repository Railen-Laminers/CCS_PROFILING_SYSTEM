import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { userAPI } from '@/services/api';

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
  const { user: currentUser, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  // State for behavior records
  const [warnings, setWarnings] = useState(0);
  const [suspensions, setSuspensions] = useState(0);
  const [counseling, setCounseling] = useState(0);
  const [incidents, setIncidents] = useState('');
  const [counselingRecords, setCounselingRecords] = useState('');

  // Load existing data
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?._id) {
        setLoading(false);
        return;
      }
      try {
        const userData = await userAPI.getUser(currentUser._id);
        const records = userData.student?.behavior_discipline_records || {};
        setWarnings(records.warnings || 0);
        setSuspensions(records.suspensions || 0);
        setCounseling(records.counseling || 0);
        setIncidents(records.incidents || '');
        setCounselingRecords(records.counselingRecords || '');
      } catch (err) {
        console.error('Failed to fetch behavior records:', err);
        showToast('Could not load behavior records', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser, showToast]);

  const labelClass = `text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300`;
  const readOnlyContainerClass = `w-full p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
        <FiLoader className="w-8 h-8 animate-spin text-orange-500 dark:text-orange-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-zinc-900">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center text-sm font-medium mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto rounded-xl shadow-sm overflow-hidden bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8 pb-2 border-b border-gray-100 dark:border-gray-800">
            <AlertIcon className="w-5 h-5 text-orange-500 dark:text-orange-400" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Behavior & Discipline Records
            </h2>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Warnings</h4>
              <p className="text-4xl font-extrabold text-yellow-500">{warnings}</p>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Suspensions</h4>
              <p className="text-4xl font-extrabold text-red-500">{suspensions}</p>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Counseling Sessions</h4>
              <p className="text-4xl font-extrabold text-blue-500">{counseling}</p>
            </div>
          </div>

          {/* Incidents Field (read‑only) */}
          <div className="space-y-1 mb-4">
            <label className={labelClass}>Incidents</label>
            <div className={readOnlyContainerClass}>
              {incidents || <span className="text-gray-400 dark:text-gray-500">—</span>}
            </div>
          </div>

          {/* Counseling Records Field (read‑only) */}
          <div className="space-y-1 mb-4">
            <label className={labelClass}>Counseling Records</label>
            <div className={readOnlyContainerClass}>
              {counselingRecords || <span className="text-gray-400 dark:text-gray-500">—</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorRecordsForm;