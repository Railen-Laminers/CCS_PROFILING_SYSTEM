import React, { useState } from 'react';
import { 
  FiFileText, 
  FiChevronRight,
  FiPlus,
  FiBookOpen,
  FiTrendingUp,
  FiLayers
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useInstruction from '@/hooks/useInstruction';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import CourseFormModal from '@/components/forms/CourseFormModal';
import { courseAPI } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';

const CourseRow = ({ course }) => {
  const navigate = useNavigate();
  return (
    <div 
      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md hover:border-brand-500/30 transition-all duration-300 group cursor-pointer active:scale-[0.99]"
      onClick={() => navigate(`/admin/instruction/course/${course._id}`)}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="bg-brand-500/10 text-brand-500 font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-colors">
          {course.course_code}
        </div>
        <div className="flex flex-col">
          <h4 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors leading-none tracking-tight">
            {course.course_title}
          </h4>
          <span className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5 flex items-center gap-1">
             <FiLayers className="w-3 h-3" /> {course.units} UNITS
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-gray-400 dark:text-zinc-600 transition-colors group-hover:text-brand-500/60">
          <FiFileText className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Syllabus</span>
        </div>
        <div className="flex items-center gap-1 text-brand-500 group-hover:translate-x-1 transition-transform">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Manage</span>
          <FiChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const Instruction = () => {
  const { showToast } = useToast();
  const [selectedProgram, setSelectedProgram] = useState('BSIT');
  const {
    curriculum,
    loading,
    error,
    refresh
  } = useInstruction(selectedProgram);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preselect, setPreselect] = useState({ year: 1, sem: 1 });

  const handleAddClick = (year = 1, sem = 1) => {
    setPreselect({ year, sem });
    setIsModalOpen(true);
  };

  const handleCreateCourse = async (courseData) => {
    try {
      await courseAPI.createCourse(courseData);
      showToast('Course successfully added to curriculum.', 'success');
      refresh?.();
    } catch (err) {
      console.error('Create course error:', err);
      const msg = err.response?.data?.message || 'Failed to create course. Please check inputs.';
      showToast(msg, 'error');
      throw err;
    }
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Instruction Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 dark:bg-[#18181B] p-1 rounded-xl flex items-center shadow-inner border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setSelectedProgram('BSIT')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                selectedProgram === 'BSIT' 
                  ? 'bg-white dark:bg-[#252525] text-brand-500 shadow-sm border border-gray-200 dark:border-gray-700' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-transparent'
              }`}
            >
              BSIT
            </button>
            <button
              onClick={() => setSelectedProgram('BSCS')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                selectedProgram === 'BSCS' 
                  ? 'bg-white dark:bg-[#252525] text-brand-500 shadow-sm border border-gray-200 dark:border-gray-700' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-transparent'
              }`}
            >
              BSCS
            </button>
            <button
              onClick={() => setSelectedProgram('BSIS')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                selectedProgram === 'BSIS' 
                  ? 'bg-white dark:bg-[#252525] text-brand-500 shadow-sm border border-gray-200 dark:border-gray-700' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-transparent'
              }`}
            >
              BSIS
            </button>
          </div>
          <button
            onClick={() => handleAddClick(1, 1)}
            className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2">
              <FiPlus className="w-4 h-4" /> Add New Course
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm shadow-sm ring-1 ring-red-500/10">
          {error}
        </div>
      )}

      {/* Curriculum View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
            <div className="w-12 h-12 rounded-full border-4 border-t-brand-500 border-r-brand-500 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-sm font-bold text-gray-400 mt-4 uppercase tracking-widest">Fetching Curriculum...</p>
        </div>
      ) : (
        <div className="space-y-12 pb-12">
          {[1, 2, 3, 4].map((year) => (
            <div key={year} className="relative">
              {/* Year Header Block */}
              <div className="flex items-center gap-4 mb-6 px-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20">
                  <FiTrendingUp className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                  {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year Level
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-gray-800/50 to-transparent"></div>
              </div>

              {/* Semesters Stack */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2].map((sem) => (
                  <div key={sem} className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                        <FiBookOpen className="w-4 h-4 text-brand-500" />
                        <h3 className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] italic">
                          {sem === 1 ? 'First Semester' : 'Second Semester'}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="ghost" className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 bg-gray-100 dark:bg-zinc-800/50 px-2.5 py-0.5 rounded-lg border-none shadow-none">
                          {curriculum[year][sem].length}
                        </Badge>
                        <button 
                          onClick={() => handleAddClick(year, sem)}
                          className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all active:scale-90 shadow-sm border border-brand-500/10"
                          title={`Add course to ${year}${year===1?'st':year===2?'nd':year===3?'rd':'th'} Year ${sem===1?'1st':'2nd'} Sem`}
                        >
                          <FiPlus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {curriculum[year][sem].length > 0 ? (
                        curriculum[year][sem].map((course) => (
                          <CourseRow key={course._id} course={course} />
                        ))
                      ) : (
                        <EmptyState 
                          size="md"
                          icon={FiPlus}
                          title="Available for Establishment"
                          description="This semester is currently empty. Click the plus icon to add a new course."
                          className="py-10"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <CourseFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectYear={preselect.year}
        preselectSem={preselect.sem}
        preselectProgram={selectedProgram}
        onSubmit={handleCreateCourse}
      />
    </div>
  );
};

export default Instruction;
