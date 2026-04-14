import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiSave } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

const GraduationCapIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path fillRule="evenodd" d="M12 2.25c-3.503 0-6.47.934-8.643 2.535l1.488-1.488a.75.75 0 011.06 0l1.992 1.992a.75.75 0 001.06 0l1.992-1.992a.75.75 0 011.06 0l1.992 1.992a.75.75 0 001.06 0l1.992-1.992a.75.75 0 011.06 0l1.488 1.488C17.63 3.17 15.37 2.25 12 2.25zM7.5 7.547c0-.862.377-1.635 1.047-2.185a4.477 4.477 0 016.906 0c.67.55 1.047 1.323 1.047 2.185v.994c0 2.69-1.603 4.872-3.914 5.786l-.36.264a.75.75 0 01-.732.002l-.36-.264C9.103 13.413 7.5 11.231 7.5 8.541v-.994z" clipRule="evenodd" />
    <path d="M7.5 9c0-2.69 1.603-4.872 3.914-5.786l.36-.264a.75.75 0 01.732-.002l.36.264C14.397 4.128 16 6.31 16 9v.994c0 .862-.377 1.635-1.047 2.185a4.477 4.477 0 01-6.906 0c-.67-.55-1.047-1.323-1.047-2.185V9z" />
  </svg>
);

const AcademicPerformanceForm = ({ onCancel, onBack }) => {
  const { isDark } = useTheme();
  const [subjects, setSubjects] = useState(['']);
  const [awards, setAwards] = useState(['']);
  const [participations, setParticipations] = useState([
    { type: '', event: '', year: '' }
  ]);

  const addSubject = () => {
    setSubjects([...subjects, '']);
  };

  const updateSubject = (index, value) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const addAward = () => {
    setAwards([...awards, '']);
  };

  const updateAward = (index, value) => {
    const newAwards = [...awards];
    newAwards[index] = value;
    setAwards(newAwards);
  };

  const removeAward = (index) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  const addParticipation = () => {
    setParticipations([...participations, { type: '', event: '', year: '' }]);
  };

  const updateParticipation = (index, field, value) => {
    const newParticipations = [...participations];
    newParticipations[index][field] = value;
    setParticipations(newParticipations);
  };

  const removeParticipation = (index) => {
    setParticipations(participations.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      subjects: subjects.filter(s => s.trim() !== ''),
      awards: awards.filter(a => a.trim() !== ''),
      participations: participations.filter(p => p.type || p.event || p.year)
    };
    console.log('Form submitted:', formData);
  };

  const inputClass = (base = '') => `${base} w-full p-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`;

  const labelClass = `text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

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
        <div className="p-6">
          {/* Header */}
          <div className={`flex items-center gap-2 mb-6 pb-2 ${isDark ? 'border-gray-700' : 'border-gray-50'}`}>
            <GraduationCapIcon className="w-5 h-5 text-orange-500" />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Academic Performance</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course/Program & Year Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Course/Program *</label>
                <input 
                  type="text" 
                  placeholder="Enter course/program"
                  className={inputClass()}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Year Level *</label>
                <select className={inputClass()}>
                  <option value="">Select year level</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            {/* GPA */}
            <div className="space-y-1">
              <label className={labelClass}>GPA *</label>
              <input 
                type="text" 
                placeholder="e.g., 3.75"
                className="w-full p-2.5 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
            </div>

            {/* Current Subjects */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Current Subjects</label>
              <div className="space-y-2">
                {subjects.map((subject, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => updateSubject(index, e.target.value)}
                      placeholder="Enter subject name"
                      className="flex-1 p-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    />
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        ×
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addSubject}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Awards */}
            <div className="space-y-1">
              <label className={labelClass}>Academic Awards</label>
              <div className="space-y-2">
                {awards.map((award, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={award}
                      onChange={(e) => updateAward(index, e.target.value)}
                      placeholder="Enter award"
                      className="flex-1 p-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    />
                    {awards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAward(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        ×
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addAward}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Participation */}
            <div className="space-y-1">
              <label className={labelClass}>Academic Participation (Competitions, Quiz Bees, etc.)</label>
              <div className="space-y-2">
                {participations.map((participation, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <select
                      value={participation.type}
                      onChange={(e) => updateParticipation(index, 'type', e.target.value)}
                      className="p-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="">Type</option>
                      <option value="competition">Competition</option>
                      <option value="quizbee">Quiz Bee</option>
                      <option value="others">Others</option>
                    </select>
                    <input
                      type="text"
                      value={participation.event}
                      onChange={(e) => updateParticipation(index, 'event', e.target.value)}
                      placeholder="Event name"
                      className="p-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <input
                      type="text"
                      value={participation.year}
                      onChange={(e) => updateParticipation(index, 'year', e.target.value)}
                      placeholder="Year"
                      className="p-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    />
                    {participations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParticipation(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addParticipation}
                  className="mt-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4 text-orange-500" />
                  Add Participation
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button 
                type="button" 
                onClick={onCancel}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
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

export default AcademicPerformanceForm;