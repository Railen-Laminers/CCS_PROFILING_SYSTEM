import React, { useEffect, useState } from 'react';
import { 
  FiX, 
  FiSave, 
  FiBook, 
  FiHash, 
  FiType,
  FiLayers,
  FiCalendar,
  FiClock,
  FiFileText,
  FiUploadCloud
} from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

const CourseFormModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  initialData = null, 
  mode = 'create',
  preselectYear = 1,
  preselectSem = 1,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    course_code: '',
    course_title: '',
    units: 3,
    year_level: 1,
    semester: 1,
    syllabus: ''
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        course_code: initialData.course_code || '',
        course_title: initialData.course_title || '',
        units: initialData.units ?? 3,
        year_level: initialData.year_level ?? 1,
        semester: initialData.semester ?? 1
      });
    } else {
      setFormData({
        course_code: '',
        course_title: '',
        units: 3,
        year_level: preselectYear || 1,
        semester: preselectSem || 1
      });
    }
    setFile(null);
  }, [initialData, preselectYear, preselectSem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle number fields carefully to avoid NaN warnings in the input
    if (name === 'units' || name === 'year_level' || name === 'semester') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    let submissionData;
    if (file) {
      submissionData = new FormData();
      submissionData.append('course_code', formData.course_code);
      submissionData.append('course_title', formData.course_title);
      submissionData.append('units', formData.units === '' ? 0 : Number(formData.units));
      submissionData.append('year_level', formData.year_level === '' ? 1 : Number(formData.year_level));
      submissionData.append('semester', formData.semester === '' ? 1 : Number(formData.semester));
      submissionData.append('syllabus_file', file);
    } else {
      submissionData = {
        ...formData,
        units: formData.units === '' ? 0 : Number(formData.units),
        year_level: formData.year_level === '' ? 1 : Number(formData.year_level),
        semester: formData.semester === '' ? 1 : Number(formData.semester)
      };
    }

    try {
      await onSubmit(submissionData);
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors || { global: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all";
  const labelClass = "text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block ml-1";

  const getValue = (name) => {
    const val = formData[name];
    return (val === undefined || val === null || isNaN(val)) ? '' : val;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
              <FiBook className="w-6 h-6 text-brand-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5 tracking-tight">
                {mode === 'create' ? 'Establish New Course' : 'Refine Course Details'}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Curriculum Management</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Code */}
            <div className="space-y-2">
              <label className={labelClass}>Course Code</label>
              <div className="relative group">
                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                <input 
                  name="course_code"
                  placeholder="e.g. IT 201"
                  className={inputClass}
                  value={formData.course_code}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.course_code && <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest mt-1 ml-1">{errors.course_code[0]}</p>}
            </div>

            {/* Units */}
            <div className="space-y-2">
              <label className={labelClass}>Academic Units</label>
              <div className="relative group">
                <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                <input 
                  type="number"
                  name="units"
                  min="1"
                  max="10"
                  className={inputClass}
                  value={getValue('units')}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Course Title */}
            <div className="md:col-span-2 space-y-2">
              <label className={labelClass}>Course Title</label>
              <div className="relative group">
                <FiType className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                <input 
                  name="course_title"
                  placeholder="e.g. Data Structures and Algorithms"
                  className={inputClass}
                  value={formData.course_title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Year Level */}
            <div className="space-y-2">
              <label className={labelClass}>Year Level</label>
              <div className="relative group">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                <select 
                  name="year_level"
                  className={`${inputClass} appearance-none`}
                  value={getValue('year_level')}
                  onChange={handleChange}
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <label className={labelClass}>Semester</label>
              <div className="relative group">
                <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                <select 
                  name="semester"
                  className={`${inputClass} appearance-none`}
                  value={getValue('semester')}
                  onChange={handleChange}
                >
                  <option value={1}>1st Semester</option>
                  <option value={2}>2nd Semester</option>
                </select>
              </div>
            </div>


            {/* Syllabus File Upload */}
            <div className="md:col-span-2 space-y-2">
              <label className={labelClass}>Syllabus Attachment</label>
              <div className="relative group">
                <input 
                  type="file"
                  id="syllabus_file"
                  name="syllabus_file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <label 
                  htmlFor="syllabus_file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#18181B] hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:border-brand-500/50 transition-all cursor-pointer group"
                >
                  <FiUploadCloud className="w-8 h-8 text-gray-400 group-hover:text-brand-500 mb-2 transition-colors" />
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                    {file ? file.name : (
                      <>
                        <span className="text-brand-500">Click to attach file</span> or drag and drop
                      </>
                    )}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 20MB</span>
                </label>
                {initialData?.syllabus_file && !file && (
                  <p className="text-xs text-brand-500 mt-2 font-medium">Currently attached: {initialData.syllabus_file.split('/').pop()}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-10">
            <Button 
                type="button"
                variant="ghost" 
                onClick={onClose}
                className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[11px] text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-100 dark:border-gray-800 active:scale-95 transition-all"
            >
              Discard Changes
            </Button>
            <Button 
                type="submit"
                disabled={loading}
                className="flex-[2] h-12 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiSave className="w-4 h-4" /> 
                  {mode === 'create' ? 'Initialize Course' : 'Save Adjustments'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;
