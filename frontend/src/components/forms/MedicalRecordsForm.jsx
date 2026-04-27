import React, { useState, useEffect } from 'react';
import { FiPlus, FiSave, FiX, FiLoader, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { authAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const HeartIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
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

const MedicalRecordsForm = () => {
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

  // Load data
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

  const addAllergy = () => {
    if (allergyInput.trim()) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };
  const removeAllergy = (index) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

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

  const getBloodTypeText = (value) => value || '—';
  const renderTags = (items, emptyText = '—') => {
    if (items.length === 0) return <span className="text-gray-500 dark:text-gray-400 text-sm">{emptyText}</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span key={idx} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
            {item}
          </span>
        ))}
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
              <HeartIcon className="w-5 h-5 text-[#ff6b00]" />
            </div>
            Medical Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Blood Type */}
            <div className="space-y-2">
              <label className={labelClasses}>Blood Type</label>
              {isEditing ? (
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className={inputClasses(false, false, bloodType)}
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
              ) : (
                <div className="w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl flex items-center text-gray-900 dark:text-white text-[14px]">
                  {getBloodTypeText(bloodType)}
                </div>
              )}
            </div>

            {/* Allergies */}
            <div className="space-y-2">
              <label className={labelClasses}>Allergies</label>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={allergyInput}
                      onChange={(e) => setAllergyInput(e.target.value)}
                      placeholder="Enter allergy (e.g., Peanuts, Penicillin)"
                      className={inputClasses(false, false, allergyInput)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAllergy}
                      className="rounded-xl w-11 h-11 p-0"
                    >
                      <FiPlus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full flex items-center gap-2"
                      >
                        {allergy}
                        <button
                          type="button"
                          onClick={() => removeAllergy(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full min-h-[44px] px-4 py-2 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[14px]">
                  {renderTags(allergies, '—')}
                </div>
              )}
            </div>

            {/* Medical Condition */}
            <div className="space-y-2">
              <label className={labelClasses}>Medical Condition</label>
              {isEditing ? (
                <textarea
                  value={medicalCondition}
                  onChange={(e) => setMedicalCondition(e.target.value)}
                  rows={3}
                  className={`${inputClasses(false, false, medicalCondition)} h-auto py-3 resize-y min-h-[88px]`}
                  placeholder="e.g., Asthma, Diabetes, Hypertension"
                />
              ) : (
                <div className="w-full min-h-[44px] px-4 py-2 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[14px]">
                  {medicalCondition || '—'}
                </div>
              )}
            </div>

            {/* Disabilities */}
            <div className="space-y-2">
              <label className={labelClasses}>Disabilities / Special Needs</label>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={disabilityInput}
                      onChange={(e) => setDisabilityInput(e.target.value)}
                      placeholder="Enter disability or special need"
                      className={inputClasses(false, false, disabilityInput)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addDisability}
                      className="rounded-xl w-11 h-11 p-0"
                    >
                      <FiPlus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {disabilities.map((disability, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full flex items-center gap-2"
                      >
                        {disability}
                        <button
                          type="button"
                          onClick={() => removeDisability(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full min-h-[44px] px-4 py-2 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[14px]">
                  {renderTags(disabilities, '—')}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={handleCancelEdit} className="gap-2">
                    <FiX className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="gap-2 bg-[#ff6b00] hover:bg-orange-600">
                    {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={handleEdit} className="gap-2 bg-[#ff6b00] hover:bg-orange-600">
                  <FiEdit2 className="w-4 h-4" />
                  Edit Medical Records
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecordsForm;