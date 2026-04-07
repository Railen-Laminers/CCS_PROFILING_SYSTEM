import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiBook, FiUsers, FiClock, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { courseAPI, userAPI, studentProfileAPI } from '@/services/api';

const ClassFormModal = ({ isOpen, onClose, onSuccess, initialData = null, roomId, roomCapacity }) => {
  const [formData, setFormData] = useState({
    course_id: '',
    instructor_id: '',
    section: '',
    schedule: {
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '09:00'
    },
    room_id: roomId || '',
    repeat_weekly: false,
    until_date: ''
  });
  
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [capacityWarning, setCapacityWarning] = useState(null);
  const [filters, setFilters] = useState({ program: '', year_level: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cData, fData] = await Promise.all([
          courseAPI.getCourses(),
          userAPI.getFaculty()
        ]);
        setCourses(cData);
        setFaculties(fData);
      } catch (err) {
        console.error(err);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSections = async () => {
      try {
        const params = {};
        if (filters.program) params.program = filters.program;
        if (filters.year_level) params.year_level = filters.year_level;
        
        const sData = await studentProfileAPI.getSections(params);
        setSections(sData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSections();
  }, [isOpen, filters.program, filters.year_level]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        course_id: initialData.course_id?._id || initialData.course_id || '',
        instructor_id: initialData.instructor_id?._id || initialData.instructor_id || '',
        section: initialData.section || '',
        schedule: initialData.schedule || { date: new Date().toISOString().split('T')[0], startTime: '08:00', endTime: '09:00' },
        room_id: roomId || initialData.room_id || ''
      });
    } else {
      setFormData({
        course_id: '',
        instructor_id: '',
        section: '',
        schedule: { date: new Date().toISOString().split('T')[0], startTime: '08:00', endTime: '09:00' },
        room_id: roomId || '',
        repeat_weekly: false,
        until_date: ''
      });
    }
  }, [initialData, roomId, isOpen]);

  // Check section student count against room capacity
  useEffect(() => {
    const checkCapacity = async () => {
      if (!formData.section || !roomCapacity) {
        setCapacityWarning(null);
        return;
      }
      try {
        const data = await studentProfileAPI.getSectionCount(formData.section);
        if (data.count > roomCapacity) {
          setCapacityWarning({
            section: formData.section,
            studentCount: data.count,
            capacity: roomCapacity
          });
        } else {
          setCapacityWarning(null);
        }
      } catch (err) {
        setCapacityWarning(null);
      }
    };
    checkCapacity();
  }, [formData.section, roomCapacity]);

  useEffect(() => {
    if (!isOpen) {
      setFilters({ program: '', year_level: '' });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData && courses.length > 0) {
      const courseId = initialData.course_id?._id || initialData.course_id;
      const course = courses.find(c => c._id === courseId);
      if (course) {
        setFilters({ program: course.program || '', year_level: course.year_level || '' });
      }
    }
  }, [initialData, courses]);

  const filteredCourses = courses.filter(c => {
    if (filters.program && c.program !== filters.program) return false;
    if (filters.year_level && c.year_level !== parseInt(filters.year_level)) return false;
    return true;
  });



  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setFormData(prev => ({ ...prev, course_id: '', section: '' }));
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('schedule.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        schedule: { ...prev.schedule, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await onSuccess(formData, initialData ? initialData._id : null);
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors || { global: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClass = "text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block ml-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
              <FiCalendar className="w-6 h-6 text-brand-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5 tracking-tight">
                {initialData ? 'Adjust Schedule' : 'Schedule New Class'}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Room Deployment</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {errors.global && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                <FiX className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400 leading-tight">
                {errors.global}
              </p>
            </div>
          )}

          {capacityWarning && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-8 h-8 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 flex-shrink-0">
                <FiAlertTriangle className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 leading-tight">
                Section <span className="font-bold">{capacityWarning.section}</span> has <span className="font-bold">{capacityWarning.studentCount} students</span> but this room only holds <span className="font-bold">{capacityWarning.capacity} seats</span>.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-1">
              <label className={labelClass}>Program</label>
              <div className="relative group">
                <FiBook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors z-10" />
                <select name="program" className={`${inputClass} appearance-none`} value={filters.program} onChange={handleFilterChange} required>
                  <option value="" disabled>Select Program</option>
                  <option value="BSIT">BS Information Technology</option>
                  <option value="BSCS">BS Computer Science</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className={labelClass}>Year Level</label>
              <div className="relative group">
                <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors z-10" />
                <select name="year_level" className={`${inputClass} appearance-none`} value={filters.year_level} onChange={handleFilterChange} disabled={!filters.program}>
                  <option value="">All Year Levels</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Course</label>
              <div className="relative group">
                <FiBook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors z-10" />
                <select name="course_id" className={`${inputClass} appearance-none`} value={formData.course_id} onChange={handleChange} required disabled={!filters.program}>
                  <option value="" disabled>Select Course</option>
                  {filteredCourses.map(c => (
                    <option key={c._id} value={c._id}>{c.course_code} - {c.course_title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Instructor</label>
              <div className="relative group">
                <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors z-10" />
                <select name="instructor_id" className={`${inputClass} appearance-none`} value={formData.instructor_id} onChange={handleChange} required disabled={!filters.program}>
                  <option value="" disabled>Select Faculty</option>
                  {faculties.map(f => (
                    <option key={f.faculty?._id} value={f.faculty?._id}>{f.user?.firstname} {f.user?.lastname}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Section</label>
              <div className="relative group">
                <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors z-10" />
                <select name="section" className={`${inputClass} appearance-none`} value={formData.section} onChange={handleChange} required disabled={!filters.program}>
                  <option value="" disabled>Select Section</option>
                  {sections.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Class Date</label>
              <div className="relative group">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors z-10" />
                <input 
                  type="date" 
                  name="schedule.date" 
                  className={inputClass} 
                  value={formData.schedule.date} 
                  onChange={handleChange} 
                  required 
                  disabled={!filters.program}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Start Time</label>
              <div className="relative group">
                <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors z-10" />
                <input type="time" name="schedule.startTime" className={inputClass} value={formData.schedule.startTime} onChange={handleChange} required disabled={!filters.program} />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>End Time</label>
              <div className="relative group">
                <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors z-10" />
                <input type="time" name="schedule.endTime" className={inputClass} value={formData.schedule.endTime} onChange={handleChange} required disabled={!filters.program} />
              </div>
            </div>

            {!initialData && (
              <>
                <div className={`md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800 ${!filters.program ? 'opacity-50 pointer-events-none' : ''}`}>
                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <div className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${formData.repeat_weekly ? 'bg-brand-500' : 'bg-gray-200 dark:bg-zinc-800'} relative`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${formData.repeat_weekly ? 'translate-x-4' : 'translate-x-0'} shadow-sm`} />
                    </div>
                    <input 
                      type="checkbox" 
                      name="repeat_weekly" 
                      className="hidden" 
                      checked={formData.repeat_weekly} 
                      onChange={(e) => setFormData(prev => ({ ...prev, repeat_weekly: e.target.checked }))} 
                      disabled={!filters.program}
                    />
                    <span className="text-sm font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest">Repeat every week</span>
                  </label>
                </div>

                {formData.repeat_weekly && (
                  <div className="md:col-span-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className={labelClass}>Repeat Until</label>
                    <div className="relative group">
                      <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors z-10" />
                      <input 
                        type="date" 
                        name="until_date" 
                        className={inputClass} 
                        value={formData.until_date} 
                        onChange={handleChange} 
                        required 
                        disabled={!filters.program}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-500 ml-1">
                      The class will be scheduled every 7 days from the start date until this date.
                    </p>
                  </div>
                )}
              </>
            )}
            
          </div>

          <div className="flex items-center gap-4 mt-10">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[11px]">Cancel</Button>
            <Button type="submit" disabled={loading || !filters.program} className="flex-[2] h-12 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave className="w-4 h-4" /> Save Schedule</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ClassFormModal;
