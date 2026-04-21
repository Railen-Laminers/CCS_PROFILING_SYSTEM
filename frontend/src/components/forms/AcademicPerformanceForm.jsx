import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiSave, FiLoader, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { authAPI } from '@/services/api';

const GraduationCapIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-3.503 0-6.47.934-8.643 2.535l1.488-1.488a.75.75 0 011.06 0l1.992 1.992a.75.75 0 001.06 0l1.992-1.992a.75.75 0 011.06 0l1.992 1.992a.75.75 0 001.06 0l1.992-1.992a.75.75 0 011.06 0l1.488 1.488C17.63 3.17 15.37 2.25 12 2.25zM7.5 7.547c0-.862.377-1.635 1.047-2.185a4.477 4.477 0 016.906 0c.67.55 1.047 1.323 1.047 2.185v.994c0 2.69-1.603 4.872-3.914 5.786l-.36.264a.75.75 0 01-.732.002l-.36-.264C9.103 13.413 7.5 11.231 7.5 8.541v-.994z" clipRule="evenodd" />
    <path d="M7.5 9c0-2.69 1.603-4.872 3.914-5.786l.36-.264a.75.75 0 01.732-.002l.36.264C14.397 4.128 16 6.31 16 9v.994c0 .862-.377 1.635-1.047 2.185a4.477 4.477 0 01-6.906 0c-.67-.55-1.047-1.323-1.047-2.185V9z" />
  </svg>
);

const AcademicPerformanceForm = ({ onCancel, onBack }) => {
  const { user: currentUser, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Read-only fields
  const [program, setProgram] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [gpa, setGpa] = useState('');
  const [currentSubjects, setCurrentSubjects] = useState([]);
  const [academicAwards, setAcademicAwards] = useState([]);

  // Editable participations
  const [quizBeeParticipations, setQuizBeeParticipations] = useState([]);
  const [programmingContests, setProgrammingContests] = useState([]);

  // Backup for cancel
  const [originalData, setOriginalData] = useState(null);

  // Load student data from auth context (user.student)
  useEffect(() => {
    if (currentUser && currentUser.student) {
      const student = currentUser.student;
      setProgram(student.program || '');
      setYearLevel(student.year_level || '');
      setGpa(student.gpa ?? '');
      setCurrentSubjects(Array.isArray(student.current_subjects) ? student.current_subjects : []);
      setAcademicAwards(Array.isArray(student.academic_awards) ? student.academic_awards : []);
      setQuizBeeParticipations(Array.isArray(student.quiz_bee_participations) ? student.quiz_bee_participations : []);
      setProgrammingContests(Array.isArray(student.programming_contests) ? student.programming_contests : []);

      setOriginalData({
        quizBeeParticipations: Array.isArray(student.quiz_bee_participations) ? [...student.quiz_bee_participations] : [],
        programmingContests: Array.isArray(student.programming_contests) ? [...student.programming_contests] : []
      });
      setLoading(false);
    } else if (currentUser === null) {
      setLoading(false);
    } else if (currentUser && !currentUser.student) {
      showToast('Student profile not found', 'error');
      setLoading(false);
    }
  }, [currentUser, showToast]);

  // Handlers for quiz bee participations
  const addQuizBee = () => setQuizBeeParticipations([...quizBeeParticipations, '']);
  const updateQuizBee = (index, value) => {
    const updated = [...quizBeeParticipations];
    updated[index] = value;
    setQuizBeeParticipations(updated);
  };
  const removeQuizBee = (index) => {
    setQuizBeeParticipations(quizBeeParticipations.filter((_, i) => i !== index));
  };

  // Handlers for programming contests
  const addProgrammingContest = () => setProgrammingContests([...programmingContests, '']);
  const updateProgrammingContest = (index, value) => {
    const updated = [...programmingContests];
    updated[index] = value;
    setProgrammingContests(updated);
  };
  const removeProgrammingContest = (index) => {
    setProgrammingContests(programmingContests.filter((_, i) => i !== index));
  };

  const handleEdit = () => {
    setOriginalData({
      quizBeeParticipations: [...quizBeeParticipations],
      programmingContests: [...programmingContests]
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (originalData) {
      setQuizBeeParticipations(originalData.quizBeeParticipations);
      setProgrammingContests(originalData.programmingContests);
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        quiz_bee_participations: quizBeeParticipations.filter(item => item.trim() !== ''),
        programming_contests: programmingContests.filter(item => item.trim() !== '')
      };

      await authAPI.updateProfile(payload);
      showToast('Academic participations updated successfully!', 'success');
      await refreshUser();

      setOriginalData({
        quizBeeParticipations: [...quizBeeParticipations],
        programmingContests: [...programmingContests]
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to update participations';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Helper to render read-only value or placeholder
  const renderReadOnlyValue = (value, placeholder = '—') => {
    return (
      <div className="w-full p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm">
        {value || placeholder}
      </div>
    );
  };

  // Helper to render tags for arrays
  const renderTags = (items, emptyText = 'No items listed') => {
    if (items.length === 0) {
      return <span className="text-sm text-gray-400 dark:text-gray-500 italic">{emptyText}</span>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
            {item}
          </span>
        ))}
      </div>
    );
  };

  const labelClass = `text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300`;
  const editableInputClass = `w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm bg-gray-50 dark:bg-[#18181B] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`;

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
        <div className="p-6">
          {/* Header - no edit button */}
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100 dark:border-gray-800">
            <GraduationCapIcon className="w-5 h-5 text-orange-500 dark:text-orange-400" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Academic Performance</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Program & Year Level (always read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Course/Program</label>
                {renderReadOnlyValue(program)}
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Year Level</label>
                {renderReadOnlyValue(yearLevel)}
              </div>
            </div>

            {/* GPA (always read-only) */}
            <div className="space-y-1">
              <label className={labelClass}>GPA</label>
              {renderReadOnlyValue(gpa)}
            </div>

            {/* Current Subjects (always read-only) */}
            <div className="space-y-1">
              <label className={labelClass}>Current Subjects</label>
              <div className="p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700 min-h-[42px]">
                {renderTags(currentSubjects, 'No subjects listed')}
              </div>
            </div>

            {/* Academic Awards (always read-only) */}
            <div className="space-y-1">
              <label className={labelClass}>Academic Awards</label>
              <div className="p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700 min-h-[42px]">
                {renderTags(academicAwards, 'No awards listed')}
              </div>
            </div>

            {/* Quiz Bee Participations */}
            <div className="space-y-2">
              <label className={labelClass}>Quiz Bee Participations</label>
              {isEditing ? (
                <>
                  {quizBeeParticipations.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateQuizBee(index, e.target.value)}
                        placeholder="e.g., Regional Quiz Bee 2024"
                        className={editableInputClass}
                      />
                      <button
                        type="button"
                        onClick={() => removeQuizBee(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addQuizBee}
                    className="mt-1 inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    <FiPlus className="w-4 h-4" /> Add Quiz Bee Participation
                  </button>
                </>
              ) : (
                <div className="p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700 min-h-[42px]">
                  {quizBeeParticipations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {quizBeeParticipations.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
                  )}
                </div>
              )}
            </div>

            {/* Programming Contests */}
            <div className="space-y-2">
              <label className={labelClass}>Programming Contests</label>
              {isEditing ? (
                <>
                  {programmingContests.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateProgrammingContest(index, e.target.value)}
                        placeholder="e.g., ICPC 2023"
                        className={editableInputClass}
                      />
                      <button
                        type="button"
                        onClick={() => removeProgrammingContest(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addProgrammingContest}
                    className="mt-1 inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    <FiPlus className="w-4 h-4" /> Add Programming Contest
                  </button>
                </>
              ) : (
                <div className="p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700 min-h-[42px]">
                  {programmingContests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {programmingContests.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
                  )}
                </div>
              )}
            </div>

            {/* Buttons - only Edit Participations in read mode, Cancel+Save Changes in edit mode */}
            <div className="flex justify-end gap-3 mt-8">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-colors bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
                  >
                    {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Participations
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AcademicPerformanceForm;