import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiSave, FiX } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

const HeartIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const MedicalRecordsForm = ({ onCancel, onBack }) => {
  const { isDark } = useTheme();
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [conditions, setConditions] = useState([]);
  const [conditionInput, setConditionInput] = useState('');
  const [disabilities, setDisabilities] = useState([]);
  const [disabilityInput, setDisabilityInput] = useState('');

  const addAllergy = () => {
    if (allergyInput.trim()) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (index) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const addCondition = () => {
    if (conditionInput.trim()) {
      setConditions([...conditions, conditionInput.trim()]);
      setConditionInput('');
    }
  };

  const removeCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      bloodType,
      allergies,
      conditions,
      disabilities
    };
    console.log('Form submitted:', formData);
  };

  const inputClass = `w-full p-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`;
  const labelClass = `text-sm font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`;

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
            <HeartIcon className="w-5 h-5 text-orange-500" />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Medical Records</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Type */}
            <div className="space-y-1">
              <label className={labelClass}>Blood Type *</label>
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
            </div>

            {/* Allergies */}
            <div className="space-y-1">
              <label className={labelClass}>Allergies</label>
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
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-700'}`}
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
            </div>

            {/* Medical Conditions */}
            <div className="space-y-1">
              <label className={labelClass}>Medical Conditions</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  placeholder="Enter medical condition (e.g., Asthma, Diabetes)"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={addCondition}
                  className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
              {conditions.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {conditions.map((condition, index) => (
                    <span 
                      key={index}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700'}`}
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="hover:bg-blue-100 rounded-full p-0.5"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic mt-2">No medical conditions recorded</p>
              )}
            </div>

            {/* Disabilities */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-800 mb-2">Disabilities (if any)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={disabilityInput}
                  onChange={(e) => setDisabilityInput(e.target.value)}
                  placeholder="Enter disability or special needs"
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
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
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
            </div>

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

export default MedicalRecordsForm;