import React from 'react';
import { 
  FiBookOpen, 
  FiFileText, 
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiUsers,
  FiPlus
} from 'react-icons/fi';
import useInstruction from '@/hooks/useInstruction';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { FiSearch } from 'react-icons/fi';

const StatCards = ({ statCards }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {statCards.map((card, index) => (
      <Card key={index} className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{card.count}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-1">{card.label}</p>
            </div>
            <div className={`${card.bgColor} rounded-xl p-3 shadow-inner`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex space-x-2 mb-8 overflow-x-auto p-2 bg-gray-100 dark:bg-[#252525] rounded-[1.25rem] border border-gray-200 dark:border-gray-800 scrollbar-hide shadow-inner relative overflow-hidden">
    {tabs.map((tab, index) => (
      <button
        key={index}
        onClick={() => setActiveTab(index)}
        className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all rounded-[1.25rem] relative z-10 focus:outline-none ${
          activeTab === index
            ? 'bg-white dark:bg-[#1E1E1E] text-brand-600 dark:text-brand-500 shadow-sm ring-1 ring-zinc-200 dark:ring-white/10 backdrop-blur-md'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-[#2C2C2C]'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const ClassItem = ({ cls, handleEdit, handleDelete }) => (
  <Card className="bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
    <CardContent className="p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-brand-500 text-white font-bold px-4 py-1.5 rounded-xl text-sm shadow-sm ring-1 ring-white/10">
            {cls.courseCode}
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors line-clamp-1 leading-tight">
              {cls.courseCode} - {cls.courseTitle}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <FiUsers className="w-4 h-4 text-gray-500" />
              <p className="text-[14px] font-medium text-gray-500 dark:text-zinc-500">
                {cls.studentsCount || 35} students enrolled
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-12 flex-1 max-w-2xl px-6 border-l border-gray-100 dark:border-gray-800 ml-6 hidden lg:grid">
          <div className="flex items-center gap-3 text-gray-600 dark:text-zinc-400">
            <FiClock className="w-4 h-4 text-brand-500" />
            <span className="text-[14px] font-semibold">{cls.schedule}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-zinc-400">
            <FiMapPin className="w-4 h-4 text-brand-500" />
            <span className="text-[14px] font-semibold">{cls.room}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-zinc-400">
            <FiUser className="w-4 h-4 text-brand-500" />
            <span className="text-[14px] font-semibold truncate">{cls.instructor}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button 
            onClick={() => handleEdit('class', cls.raw)}
            className="h-9 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[13px] font-semibold transition-all px-6 active:scale-95 shadow-sm"
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleDelete('class', cls.id)}
            className="h-9 border border-gray-200 dark:border-gray-700 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800 rounded-lg text-[13px] font-semibold px-6 transition-all active:scale-95 text-left"
          >
            Delete
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);


const AssignmentItem = ({ assignment, handleEdit, handleDelete }) => (
  <Card className="bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
    <CardContent className="p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6 text-left">
          <div className={`p-2.5 rounded-lg border shadow-sm ${assignment.status === 'open' ? 'bg-green-500/10 border-green-500/20' : 'bg-gray-500/10 border-gray-500/20'}`}>
            <FiFileText className={`w-[18px] h-[18px] ${assignment.status === 'open' ? 'text-green-500' : 'text-gray-500'}`} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3">
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors">
                {assignment.title}
              </h3>
              <Badge className={`${assignment.status === 'open' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-zinc-500/20 text-zinc-500 border-zinc-500/30'} rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
                {assignment.status}
              </Badge>
            </div>
            <p className="text-[14px] text-gray-500 dark:text-zinc-500 mt-0.5">Course: <span className="text-brand-500 font-semibold">{assignment.class_id?.course_id?.course_code || 'N/A'}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-12 ml-6">
          <div className="flex items-center gap-2.5 text-gray-500 dark:text-zinc-400">
            <FiCalendar className="w-4 h-4 text-brand-500" />
            <span className="text-[14px] font-medium italic">Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-500 dark:text-zinc-400">
            <FiUsers className="w-4 h-4 text-brand-500" />
            <span className="text-[14px] font-medium">Submitted: <span className="text-gray-900 dark:text-white font-semibold">32/45</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => handleEdit('assignment', assignment)}
            className="h-9 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[13px] font-semibold px-6 shadow-sm active:scale-95 transition-all text-left"
          >
            Edit
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleDelete('assignment', assignment._id)}
            className="h-9 text-red-500 hover:text-red-700 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 dark:hover:bg-red-900/10 rounded-lg text-[13px] font-semibold px-6 transition-all active:scale-95 text-left"
          >
            Delete
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);


const LessonPlanItem = ({ plan, handleEdit, handleDelete }) => (
  <Card className="bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl group">
    <CardContent className="p-5">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20 text-left">
            <FiCalendar className="w-5 h-5 text-brand-500" />
          </div>
          <div className="text-left">
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 mb-0.5 leading-tight">{plan.topic}</h3>
            <p className="text-[12px] font-semibold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-2 py-0.5 rounded text-left inline-block">
              {plan.class_id?.course_id?.course_code || 'GENERAL'}
            </p>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-zinc-800/50 px-3 py-1 rounded-md text-xs font-bold text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700">
          Week {plan.week_number || 1}
        </div>
      </div>

      <div className="space-y-3 mb-6 font-medium text-left">
        <div className="text-left">
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 text-left">Objectives</p>
          <p className="text-[14px] text-gray-700 dark:text-zinc-300 line-clamp-2 text-left">{plan.objectives || 'No objectives stated.'}</p>
        </div>
        <div className="text-left">
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 text-left">Date & Duration</p>
          <div className="flex items-center gap-4 text-[14px] text-gray-600 dark:text-zinc-400 text-left">
            <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(plan.date).toLocaleDateString()}</span>
            <span className="italic">90 minutes duration</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800/50">
        <Button 
          onClick={() => handleEdit('lesson', plan)}
          className="h-9 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[13px] font-semibold shadow-sm active:scale-95 transition-all text-left"
        >
          Edit Plan
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleDelete('lesson', plan._id)}
          className="h-9 border-gray-200 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-[13px] font-semibold transition-all active:scale-95 text-left"
        >
          Delete
        </Button>
      </div>
    </CardContent>
  </Card>
);


const MaterialItem = ({ material, handleEdit, handleDelete }) => {
  const getFileIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'pdf': return <FiFileText className="h-6 w-6 text-red-500 text-left" />;
      case 'docx': return <FiFileText className="h-6 w-6 text-blue-500 text-left" />;
      case 'slides': return <FiBookOpen className="h-6 w-6 text-orange-500 text-left" />;
      default: return <FiFileText className="h-6 w-6 text-gray-500 text-left" />;
    }
  };

  return (
    <Card className="bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl group text-left">
      <CardContent className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-left">
            <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-brand-500/10 border border-brand-500/20 group-hover:scale-110 transition-transform duration-300 text-left">
              {getFileIcon(material.type)}
            </div>
            <div className="text-left">
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors text-left">
                {material.title}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-left">
                <span className="text-[11px] font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-2 py-0.5 rounded text-left">
                  {material.type}
                </span>
                <p className="text-[13px] text-gray-500 dark:text-zinc-500 text-left">
                  Course: <span className="text-gray-700 dark:text-zinc-300 font-semibold">{material.class_id?.course_id?.course_code || 'N/A'}</span>
                  <span className="mx-2 opacity-30">•</span>
                  Added: {new Date(material.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <button 
              onClick={() => handleEdit('material', material)}
              className="h-9 bg-brand-500 hover:bg-brand-400 text-white rounded-lg text-[13px] font-semibold px-8 shadow-sm active:scale-95 transition-all outline-none text-left"
            >
              Edit
            </button>
            <button 
              onClick={() => handleDelete('material', material._id)}
              className="h-9 text-red-500 hover:text-red-700 border border-gray-200 dark:border-gray-700 dark:hover:bg-red-900/10 rounded-lg px-6 text-[13px] font-semibold transition-all outline-none active:scale-95 text-left"
            >
              Delete
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


// --- Modals ---

const InstructionFormModal = ({ isOpen, onClose, mode, type, initialData, onSave, allCourses, allFaculty, classes }) => {
  const [formData, setFormData] = React.useState({});
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData);
      } else {
        setFormData({});
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(type, formData, mode === 'edit' ? initialData._id : null);
    setIsSaving(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderFields = () => {
    switch(type) {
      case 'class':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Course</label>
                <select name="course_id" value={formData.course_id || ''} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-brand-500/20" required>
                  <option value="">Select Course</option>
                  {allCourses.map(c => <option key={c._id} value={c._id}>{c.course_code} - {c.course_title}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Instructor</label>
                <select name="instructor_id" value={formData.instructor_id || ''} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-brand-500/20" required>
                  <option value="">Select Instructor</option>
                  {allFaculty.map(f => <option key={f._id} value={f._id}>{f.user_id?.firstname} {f.user_id?.lastname}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Schedule</label>
                <input name="schedule" value={formData.schedule || ''} onChange={handleChange} placeholder="e.g. MW 9:00AM - 10:30AM" className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-brand-500/20" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Room</label>
                <input name="room" value={formData.room || ''} onChange={handleChange} placeholder="e.g. Lab 101" className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-brand-500/20" required />
              </div>
            </div>
          </>
        );
      case 'assignment':
        return (
          <>
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold">Class</label>
              <select name="class_id" value={formData.class_id || ''} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900" required>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.raw._id}>{c.courseCode} - {c.instructor}</option>)}
              </select>
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold">Title</label>
              <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Assignment Title" className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900" required />
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Due Date</label>
                <input name="due_date" type="date" value={formData.due_date ? formData.due_date.split('T')[0] : ''} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Status</label>
                <select name="status" value={formData.status || 'open'} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900">
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold">Description</label>
              <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="3" className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900"></textarea>
            </div>
          </>
        );
      case 'lesson':
        return (
          <>
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold">Class</label>
              <select name="class_id" value={formData.class_id || ''} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900" required>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.raw._id}>{c.courseCode} - {c.instructor}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Topic</label>
                <input name="topic" value={formData.topic || ''} onChange={handleChange} placeholder="Lesson Topic" className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Date</label>
                <input name="date" type="date" value={formData.date ? formData.date.split('T')[0] : ''} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900" required />
              </div>
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold">Objectives</label>
              <textarea name="objectives" value={formData.objectives || ''} onChange={handleChange} rows="3" className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900"></textarea>
            </div>
          </>
        );
      case 'material':
        return (
          <>
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold">Class</label>
              <select name="class_id" value={formData.class_id || ''} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900" required>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.raw._id}>{c.courseCode} - {c.instructor}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Title</label>
                <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Material Title" className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Type</label>
                <select name="type" value={formData.type || 'document'} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900" required>
                  <option value="document">Document (PDF/Word)</option>
                  <option value="presentation">Presentation (Slides)</option>
                  <option value="video">Video</option>
                  <option value="link">Link</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold">File URL / Link</label>
              <input name="file_url" value={formData.file_url || ''} onChange={handleChange} placeholder="https://..." className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900" />
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4 text-left">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center text-left">
          <h2 className="text-xl font-bold capitalize text-left">
            {mode === 'edit' ? 'Edit' : 'Add New'} {type === 'lesson' ? 'Lesson Plan' : type}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-left">
            <FiPlus className="w-5 h-5 rotate-45 text-left" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {renderFields()}
          <div className="flex justify-end gap-3 pt-4 text-left">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-bold shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all text-left">
              {isSaving ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, type }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[70] p-4 text-left">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 p-8 animate-in zoom-in duration-200 text-left">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
          <FiBookOpen className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-center mb-2 text-left">Delete {type}?</h2>
        <p className="text-gray-500 dark:text-zinc-400 text-center mb-8 text-left">Are you sure you want to remove this item? This action cannot be undone.</p>
        <div className="flex gap-3 text-left">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl font-bold transition-colors text-left">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all text-left">Delete</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const Instruction = () => {
  const {
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    tabs, statCards, filteredClasses,
    assignments, lessonPlans, materials,
    allCourses, allFaculty, classes,
    loading,
    isFormOpen, setIsFormOpen,
    isConfirmOpen, setIsConfirmOpen,
    modalMode, setModalMode,
    selectedItem, setSelectedItem,
    handleSave, handleDelete
  } = useInstruction();

  const [formType, setFormType] = React.useState('class');

  const openAddModal = (type) => {
    setFormType(type);
    setModalMode('create');
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const openEditModal = (type, item) => {
    setFormType(type);
    setModalMode('edit');
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const openDeleteModal = (type, id) => {
    setFormType(type);
    setSelectedItem({ _id: id });
    setIsConfirmOpen(true);
  };

  if (loading && !searchQuery) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[400px] text-left">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 text-left"></div>
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 text-left">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight text-left text-left">Instruction Management</h1>
        <div className="flex items-center gap-3 text-left">
          <button
            onClick={() => {
              const types = ['class', 'assignment', 'lesson', 'material'];
              openAddModal(types[activeTab]);
            }}
            className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 text-left"
          >
            <span className="relative z-10 flex items-center gap-2 text-left">
              <FiPlus className="w-4 h-4 text-left" /> Add New {activeTab === 0 ? 'Class' : activeTab === 1 ? 'Assignment' : activeTab === 2 ? 'Lesson' : 'Material'}
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100 text-left"></div>
          </button>
        </div>
      </div>

      <StatCards statCards={statCards} />
      
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="space-y-6 text-left">
        {/* Classes Tab */}
        {activeTab === 0 && (
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm text-left">
            <div className="relative group max-w-sm ml-auto mb-6 text-left">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-left">
                <FiSearch className="h-5 w-5 text-gray-400 dark:text-zinc-500 group-focus-within:text-brand-500 transition-colors text-left" />
              </div>
              <input
                type="text"
                placeholder="Search classes..."
                className="block w-full h-10 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm text-left"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4 text-left">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls, index) => (
                  <ClassItem 
                    key={cls.id || index} 
                    cls={cls} 
                    handleEdit={openEditModal} 
                    handleDelete={openDeleteModal} 
                  />
                ))
              ) : (
                <EmptyState 
                  icon={<FiBookOpen className="w-12 h-12 text-gray-300 dark:text-zinc-700" />} 
                  title={searchQuery ? `No results match "${searchQuery}"` : "No classes found in the database."}
                  className="bg-gray-50 dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800 rounded-2xl py-16 shadow-none"
                />
              )}
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 1 && (
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm text-left">
            <div className="space-y-4 text-left">
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <AssignmentItem 
                    key={assignment._id || index} 
                    assignment={assignment} 
                    handleEdit={openEditModal} 
                    handleDelete={openDeleteModal} 
                  />
                ))
              ) : (
                <EmptyState 
                  icon={<FiFileText className="w-12 h-12 text-gray-300 dark:text-zinc-700" />} 
                  title="No assignments found in the database."
                  className="bg-gray-50 dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800 rounded-2xl py-16 shadow-none"
                />
              )}
            </div>
          </div>
        )}

        {/* Lesson Plans Tab */}
        {activeTab === 2 && (
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm text-left">
            <div className="space-y-4 text-left">
              {lessonPlans.length > 0 ? (
                lessonPlans.map((plan, index) => (
                  <LessonPlanItem 
                    key={plan._id || index} 
                    plan={plan} 
                    handleEdit={openEditModal} 
                    handleDelete={openDeleteModal} 
                  />
                ))
              ) : (
                <EmptyState 
                  icon={<FiCalendar className="w-12 h-12 text-gray-300 dark:text-zinc-700" />} 
                  title="No lesson plans found in the database."
                  className="bg-gray-50 dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800 rounded-2xl py-16 shadow-none"
                />
              )}
            </div>
          </div>
        )}

        {/* Course Materials Tab */}
        {activeTab === 3 && (
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm text-left">
            <div className="space-y-4 text-left">
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <MaterialItem 
                    key={material._id || index} 
                    material={material} 
                    handleEdit={openEditModal} 
                    handleDelete={openDeleteModal} 
                  />
                ))
              ) : (
                <EmptyState 
                  icon={<FiBookOpen className="w-12 h-12 text-gray-300 dark:text-zinc-700" />} 
                  title="No course materials found in the database."
                  className="bg-gray-50 dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800 rounded-2xl py-16 shadow-none"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Unified Modals */}
      <InstructionFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={modalMode}
        type={formType}
        initialData={selectedItem}
        onSave={handleSave}
        allCourses={allCourses}
        allFaculty={allFaculty}
        classes={classes}
      />

      <DeleteConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => handleDelete(formType, selectedItem._id)}
        type={formType}
      />
    </div>
  );
};

export default Instruction;
