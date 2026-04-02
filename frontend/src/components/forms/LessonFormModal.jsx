import React, { useState } from 'react';
import { 
  FiX, 
  FiSave, 
  FiList, 
  FiType,
  FiCalendar,
  FiHash,
  FiFileText,
  FiUploadCloud
} from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

const LessonFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null 
}) => {
  const [formData, setFormData] = useState({
    topic: initialData?.topic || '',
    week_number: initialData?.week_number || 1,
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'week_number' ? (value === '' ? '' : parseInt(value)) : value
    }));
    
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
    
    let submissionData;
    if (file) {
      submissionData = new FormData();
      submissionData.append('topic', formData.topic);
      submissionData.append('week_number', formData.week_number === '' ? 1 : Number(formData.week_number));
      submissionData.append('date', formData.date);
      submissionData.append('attached_file', file);
    } else {
      submissionData = {
        ...formData,
        week_number: formData.week_number === '' ? 1 : Number(formData.week_number)
      };
    }

    try {
      await onSubmit(submissionData);
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors || { global: 'Failed to save lesson.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all";
  const labelClass = "text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block ml-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1E1E1E] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
              <FiList className="w-6 h-6 text-brand-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5 tracking-tight">
                Establish Lesson Module
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Curriculum Builder</p>
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
          <div className="space-y-6">
            {/* Topic */}
            <div className="space-y-2">
              <label className={labelClass}>Lesson Topic</label>
              <div className="relative group">
                <FiType className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                <input 
                  name="topic"
                  placeholder="e.g. Introduction to Asymptotic Notation"
                  className={inputClass}
                  value={formData.topic}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Week Number */}
              <div className="space-y-2">
                <label className={labelClass}>Week Number</label>
                <div className="relative group">
                  <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                  <input 
                    type="number"
                    name="week_number"
                    min="1"
                    max="18"
                    className={inputClass}
                    value={formData.week_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className={labelClass}>Initial Date</label>
                <div className="relative group">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                  <input 
                    type="date"
                    name="date"
                    className={inputClass}
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>



            {/* Attached File Upload */}
            <div className="space-y-2 mt-4">
              <label className={labelClass}>Material Attachment</label>
              <div className="relative group">
                <input 
                  type="file"
                  id="attached_file"
                  name="attached_file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                />
                <label 
                  htmlFor="attached_file"
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
                  <span className="text-xs text-gray-400 mt-1">PDF, DOC, PPT up to 20MB</span>
                </label>
                {initialData?.attached_file && !file && (
                  <p className="text-xs text-brand-500 mt-2 font-medium">Currently attached: {initialData.attached_file.split('/').pop()}</p>
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
              Discard
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
                  Initialize Module
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonFormModal;
