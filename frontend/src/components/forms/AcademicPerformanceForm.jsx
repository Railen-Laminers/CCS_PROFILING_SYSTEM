import React, { useState, useEffect } from 'react';
import { FiPlus, FiSave, FiLoader, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { authAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const GraduationCapIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-3.503 0-6.47.934-8.643 2.535l1.488-1.488a.75.75 0 011.06 0l1.992 1.992a.75.75 0 001.06 0l1.992-1.992a.75.75 0 011.06 0l1.992 1.992a.75.75 0 001.06 0l1.992-1.992a.75.75 0 011.06 0l1.488 1.488C17.63 3.17 15.37 2.25 12 2.25zM7.5 7.547c0-.862.377-1.635 1.047-2.185a4.477 4.477 0 016.906 0c.67.55 1.047 1.323 1.047 2.185v.994c0 2.69-1.603 4.872-3.914 5.786l-.36.264a.75.75 0 01-.732.002l-.36-.264C9.103 13.413 7.5 11.231 7.5 8.541v-.994z" clipRule="evenodd" />
    <path d="M7.5 9c0-2.69 1.603-4.872 3.914-5.786l.36-.264a.75.75 0 01.732-.002l.36.264C14.397 4.128 16 6.31 16 9v.994c0 .862-.377 1.635-1.047 2.185a4.477 4.477 0 01-6.906 0c-.67-.55-1.047-1.323-1.047-2.185V9z" />
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

const AcademicPerformanceForm = () => {
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

  // Load student data
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

  const addQuizBee = () => setQuizBeeParticipations([...quizBeeParticipations, '']);
  const updateQuizBee = (index, value) => {
    const updated = [...quizBeeParticipations];
    updated[index] = value;
    setQuizBeeParticipations(updated);
  };
  const removeQuizBee = (index) => {
    setQuizBeeParticipations(quizBeeParticipations.filter((_, i) => i !== index));
  };

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
              <GraduationCapIcon className="w-5 h-5 text-[#ff6b00]" />
            </div>
            Academic Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Program & Year Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClasses}>Course/Program</label>
                <input
                  type="text"
                  className={inputClasses(false, false, null)}
                  value={program}
                  disabled
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Year Level</label>
                <input
                  type="text"
                  className={inputClasses(false, false, null)}
                  value={yearLevel}
                  disabled
                  readOnly
                />
              </div>
            </div>

            {/* GPA */}
            <div className="space-y-2">
              <label className={labelClasses}>GPA</label>
              <input
                type="text"
                className={inputClasses(false, false, null)}
                value={gpa}
                disabled
                readOnly
              />
            </div>

            {/* Current Subjects */}
            <div className="space-y-2">
              <label className={labelClasses}>Current Subjects</label>
              <div className="w-full min-h-[44px] px-4 py-2 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[14px]">
                {renderTags(currentSubjects, 'No subjects listed')}
              </div>
            </div>

            {/* Academic Awards */}
            <div className="space-y-2">
              <label className={labelClasses}>Academic Awards</label>
              <div className="w-full min-h-[44px] px-4 py-2 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[14px]">
                {renderTags(academicAwards, 'No awards listed')}
              </div>
            </div>

            {/* Quiz Bee Participations */}
            <div className="space-y-2">
              <label className={labelClasses}>Quiz Bee Participations</label>
              {isEditing ? (
                <div className="space-y-3">
                  {quizBeeParticipations.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateQuizBee(index, e.target.value)}
                        placeholder="e.g., Regional Quiz Bee 2024"
                        className={inputClasses(false, false, item)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeQuizBee(index)}
                        className="rounded-xl w-11 h-11 p-0 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addQuizBee}
                    className="gap-2 mt-2"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Quiz Bee Participation
                  </Button>
                </div>
              ) : (
                <div className="w-full min-h-[44px] px-4 py-2 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[14px]">
                  {renderTags(quizBeeParticipations, '—')}
                </div>
              )}
            </div>

            {/* Programming Contests */}
            <div className="space-y-2">
              <label className={labelClasses}>Programming Contests</label>
              {isEditing ? (
                <div className="space-y-3">
                  {programmingContests.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateProgrammingContest(index, e.target.value)}
                        placeholder="e.g., ICPC 2023"
                        className={inputClasses(false, false, item)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeProgrammingContest(index)}
                        className="rounded-xl w-11 h-11 p-0 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProgrammingContest}
                    className="gap-2 mt-2"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Programming Contest
                  </Button>
                </div>
              ) : (
                <div className="w-full min-h-[44px] px-4 py-2 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[14px]">
                  {renderTags(programmingContests, '—')}
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
                  Edit Participations
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademicPerformanceForm;