import React, { useState, useEffect } from 'react';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { userAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

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

const BehaviorRecordsForm = () => {
  const { user: currentUser } = useAuth();
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
              <AlertIcon className="w-5 h-5 text-[#ff6b00]" />
            </div>
            Behavior & Discipline Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-[#18181B] p-4 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Warnings</h4>
              <p className="text-4xl font-extrabold text-yellow-500">{warnings}</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#18181B] p-4 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Suspensions</h4>
              <p className="text-4xl font-extrabold text-red-500">{suspensions}</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#18181B] p-4 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Counseling Sessions</h4>
              <p className="text-4xl font-extrabold text-blue-500">{counseling}</p>
            </div>
          </div>

          {/* Incidents Field (read‑only) */}
          <div className="space-y-2">
            <label className={labelClasses}>Incidents</label>
            <input
              type="text"
              className={inputClasses(false, false, incidents)}
              value={incidents || '—'}
              disabled
              readOnly
            />
          </div>

          {/* Counseling Records Field (read‑only) */}
          <div className="space-y-2">
            <label className={labelClasses}>Counseling Records</label>
            <input
              type="text"
              className={inputClasses(false, false, counselingRecords)}
              value={counselingRecords || '—'}
              disabled
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehaviorRecordsForm;