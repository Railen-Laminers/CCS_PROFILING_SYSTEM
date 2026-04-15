import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiSave, FiX, FiLoader, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { authAPI } from '@/services/api';

const HeartIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const MedicalRecordsForm = ({ onCancel, onBack }) => {
  const { user: currentUser, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [disabilities, setDisabilities] = useState([]);
  const [disabilityInput, setDisabilityInput] = useState('');

  // Backup for cancel
  const [originalData, setOriginalData] = useState(null);

  // Load data from currentUser
  useEffect(() => {
    if (currentUser && currentUser.student) {
      const student = currentUser.student;
      const initialData = {
        bloodType: student.blood_type || '',
        allergies: Array.isArray(student.allergies) ? student.allergies : [],
        medicalCondition: student.medical_condition || '',
        disabilities: Array.isArray(student.disabilities) ? student.disabilities : [],
      };
      setBloodType(initialData.bloodType);
      setAllergies(initialData.allergies);
      setMedicalCondition(initialData.medicalCondition);
      setDisabilities(initialData.disabilities);
      setOriginalData(initialData);
      setLoading(false);
    } else if (currentUser === null) {
      setLoading(false);
    } else if (currentUser && !currentUser.student) {
      showToast('Student profile not found', 'error');
      setLoading(false);
    }
  }, [currentUser, showToast]);

  // Handlers for allergies
  const addAllergy = () => {
    if (allergyInput.trim()) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };
  const removeAllergy = (index) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  // Handlers for disabilities
  const addDisability = () => {
    if (disabilityInput.trim()) {
      setDisabilities([...disabilities, disabilityInput.trim()]);
      setDisabilityInput('');
    }
  };
  const removeDisability = (index) => {
    setDisabilities(disabilities.filter((_, i) => i !== index));
  };

  const handleEdit = () => {
    // Backup current data
    setOriginalData({
      bloodType,
      allergies: [...allergies],
      medicalCondition,
      disabilities: [...disabilities],
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (originalData) {
      setBloodType(originalData.bloodType);
      setAllergies(originalData.allergies);
      setMedicalCondition(originalData.medicalCondition);
      setDisabilities(originalData.disabilities);
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        blood_type: bloodType || null,
        allergies: allergies.filter(item => item.trim() !== ''),
        medical_condition: medicalCondition.trim() || null,
        disabilities: disabilities.filter(item => item.trim() !== '')
      };

      await authAPI.updateProfile(payload);
      showToast('Medical records updated successfully!', 'success');
      await refreshUser();

      // Update original data after successful save
      setOriginalData({
        bloodType,
        allergies: [...allergies],
        medicalCondition,
        disabilities: [...disabilities],
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to update medical records';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Helper to render blood type display text
  const getBloodTypeText = (value) => {
    if (!value) return '—';
    return value;
  };

  // Helper to render read-only value with placeholder
  const renderReadOnlyValue = (value, placeholder = '—') => {
    return (
      <div className="w-full p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm">
        {value || placeholder}
      </div>
    );
  };

  const inputClass = `w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-gray-50 dark:bg-[#18181B] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`;
  const labelClass = `text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300`;

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
          <div className="flex items-center justify-between mb-8 pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <HeartIcon className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Medical Records</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Type */}
            <div className="space-y-1">
              <label className={labelClass}>Blood Type</label>
              {isEditing ? (
                <div className="relative">
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  <svg className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              ) : (
                renderReadOnlyValue(getBloodTypeText(bloodType))
              )}
            </div>

            {/* Allergies (array) */}
            <div className="space-y-1">
              <label className={labelClass}>Allergies</label>
              {isEditing ? (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={allergyInput}
                      onChange={(e) => setAllergyInput(e.target.value)}
                      placeholder="Enter allergy (e.g., Peanuts, Penicillin)"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={addAllergy}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  {allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                        >
                          {allergy}
                          <button
                            type="button"
                            onClick={() => removeAllergy(index)}
                            className="hover:bg-red-100 rounded-full p-0.5"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic mt-2">No allergies recorded</p>
                  )}
                </>
              ) : (
                <div className="w-full p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700 min-h-[42px]">
                  {allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {allergies.map((allergy, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
                  )}
                </div>
              )}
            </div>

            {/* Medical Condition (single string) */}
            <div className="space-y-1">
              <label className={labelClass}>Medical Condition</label>
              {isEditing ? (
                <>
                  <textarea
                    value={medicalCondition}
                    onChange={(e) => setMedicalCondition(e.target.value)}
                    placeholder="e.g., Asthma, Diabetes, Hypertension"
                    rows="2"
                    className={`${inputClass} resize-none`}
                  />
                  <p className="text-xs text-gray-400">List any chronic conditions or health concerns</p>
                </>
              ) : (
                renderReadOnlyValue(medicalCondition)
              )}
            </div>

            {/* Disabilities (array) */}
            <div className="space-y-1">
              <label className={labelClass}>Disabilities / Special Needs</label>
              {isEditing ? (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={disabilityInput}
                      onChange={(e) => setDisabilityInput(e.target.value)}
                      placeholder="Enter disability or special need"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={addDisability}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  {disabilities.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {disabilities.map((disability, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                        >
                          {disability}
                          <button
                            type="button"
                            onClick={() => removeDisability(index)}
                            className="hover:bg-purple-100 rounded-full p-0.5"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic mt-2">No disabilities recorded</p>
                  )}
                </>
              ) : (
                <div className="w-full p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700 min-h-[42px]">
                  {disabilities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {disabilities.map((disability, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                          {disability}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
                  )}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
                  >
                    {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Medical Records
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsForm;