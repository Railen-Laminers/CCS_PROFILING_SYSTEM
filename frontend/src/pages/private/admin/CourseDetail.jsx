import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiBook, 
  FiList, 
  FiEdit3, 
  FiCalendar, 
  FiClock, 
  FiLayers,
  FiFileText,
  FiPlus,
  FiChevronRight,
  FiTrash2
} from 'react-icons/fi';
import { courseAPI, instructionAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/contexts/ToastContext';
import LessonFormModal from '@/components/forms/LessonFormModal';
import CourseFormModal from '@/components/forms/CourseFormModal';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [course, setCourse] = useState(null);
  
  const getFileUrl = (path) => {
    if (!path) return '#';
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const BASE_URL = API_BASE_URL.replace('/api', '');
    return `${BASE_URL}${path}`;
  };

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 0: Syllabus, 1: Lessons
  
  // Modal states
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [courseData, allLessons] = await Promise.all([
        courseAPI.getCourse(id),
        instructionAPI.getLessonPlans()
      ]);
      
      setCourse(courseData);
      
      // Filter lessons for this course specifically using our new course_id link
      // or fall back to class-based links for legacy data
      const courseLessons = allLessons.filter(lesson => 
        lesson.course_id?._id === id || 
        lesson.course_id === id ||
        lesson.class_id?.course_id?._id === id || 
        lesson.class_id?.course_id === id
      );
      setLessons(courseLessons);
    } catch (error) {
      console.error('Error fetching course details:', error);
      showToast('Failed to load course details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const handleDeleteCourse = async () => {
    if (!window.confirm(`CRITICAL: Are you sure you want to delete ${course.course_code}? This will permanently remove all associated curriculum data.`)) {
      return;
    }

    try {
      await courseAPI.deleteCourse(id);
      showToast(`${course.course_code} successfully removed from curriculum.`, 'success');
      navigate('/admin/instruction');
    } catch (error) {
      console.error('Delete course error:', error);
      showToast('Failed to delete course. Ensure no active dependencies exist.', 'error');
    }
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      await courseAPI.updateCourse(id, courseData);
      showToast('Course details refined successfully.', 'success');
      fetchCourseData();
    } catch (err) {
      console.error('Update course error:', err);
      const msg = err.response?.data?.message || 'Failed to update course details.';
      showToast(msg, 'error');
      throw err;
    }
  };

  const handleCreateLesson = async (lessonData) => {
    try {
      let payload;
      if (lessonData instanceof FormData) {
        lessonData.append('course_id', id);
        payload = lessonData;
      } else {
        payload = {
          ...lessonData,
          course_id: id // Link directly to this course
        };
      }

      await instructionAPI.createLessonPlan(payload);
      showToast('Lesson module successfully added.', 'success');
      fetchCourseData();
    } catch (error) {
      console.error('Create lesson error:', error);
      showToast('Failed to create lesson module.', 'error');
      throw error;
    }
  };

  const handleDeleteLesson = async (lessonId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this lesson module?')) return;

    try {
      await instructionAPI.deleteLessonPlan(lessonId);
      showToast('Lesson module removed.', 'success');
      fetchCourseData();
    } catch (error) {
      showToast('Failed to delete lesson.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
          <div className="w-10 h-10 rounded-full border-4 border-t-brand-500 border-r-brand-500 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <EmptyState 
        icon={<FiBook className="w-12 h-12 text-gray-300" />}
        title="Course not found"
        description="The course you are looking for does not exist or has been removed."
        action={
          <Button onClick={() => navigate('/admin/instruction')}>
            Back to Instruction
          </Button>
        }
      />
    );
  }

  const tabs = ['Syllabus Breakdown', 'Lessons & Materials'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header / Breadcrumbs */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/admin/instruction')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-brand-500 transition-all w-fit group"
        >
          <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Curriculum
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="bg-brand-500/10 text-brand-500 font-bold px-2.5 py-1 rounded-lg text-[11px] shrink-0 border border-brand-500/20 uppercase tracking-widest">
                    {course.course_code}
                </div>
                <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                    {course.year_level}{course.year_level === 1 ? 'st' : course.year_level === 2 ? 'nd' : course.year_level === 3 ? 'rd' : 'th'} Year Level • {course.semester === 1 ? '1st' : '2nd'} Semester
                </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none uppercase">
              {course.course_title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
                onClick={handleDeleteCourse}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                title="Delete Entire Course"
            >
                <FiTrash2 className="w-4 h-4" />
            </button>
            <Button 
                onClick={() => setIsEditModalOpen(true)}
                className="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20 flex items-center gap-2 px-6 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] h-10 transition-all active:scale-95"
            >
              <FiEdit3 className="w-4 h-4" /> Edit Course
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 bg-gray-100/50 dark:bg-zinc-900/30 p-1 rounded-xl w-fit border border-gray-200 dark:border-gray-800">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all duration-300 ${
              activeTab === index 
                ? 'bg-white dark:bg-[#1E1E1E] text-brand-500 shadow-sm border border-gray-200 dark:border-gray-800' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeTab === 0 ? (
          <>
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <CardContent className="p-6">
                  {course.syllabus_file ? (
                    <div className="flex items-center justify-between p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                          <FiFileText className="text-brand-500 w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Attached Syllabus File</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5" title={course.syllabus_file.split('/').pop()}>
                            {course.syllabus_file.split('/').pop().length > 30 
                              ? course.syllabus_file.split('/').pop().substring(0, 30) + '...' 
                              : course.syllabus_file.split('/').pop()}
                          </p>
                        </div>
                      </div>
                      <a 
                        href={getFileUrl(course.syllabus_file)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-colors shadow-sm shadow-brand-500/20 whitespace-nowrap"
                      >
                        View Document
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 bg-gray-50/50 dark:bg-[#161618] border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                      <FiFileText className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                      <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400">No Syllabus File Attached</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Edit course to upload a document</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-brand-500 text-white border-none rounded-2xl shadow-xl shadow-brand-500/25 overflow-hidden relative group">
                <div className="absolute -top-4 -right-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                  <FiBook className="w-32 h-32" />
                </div>
                <CardContent className="p-8 relative z-10">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70 mb-5">Academic Metrics</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-3xl font-black tracking-tight">{course.units || 0}</p>
                      <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">Units</p>
                    </div>
                    <div className="pt-5 border-t border-white/10">
                      <p className="text-3xl font-black tracking-tight">{lessons.length}</p>
                      <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">Lessons</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <CardContent className="p-6">
                  <h4 className="text-[9px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                    Metadata
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Added</span>
                      <span className="text-[12px] font-black text-gray-900 dark:text-gray-100">{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800/50">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Updated</span>
                      <span className="text-[12px] font-black text-gray-900 dark:text-gray-100">{new Date(course.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center mb-2 px-1">
              <h3 className="text-[12px] font-black text-gray-900 dark:text-gray-100 flex items-center gap-2.5 uppercase tracking-[0.15em]">
                <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                    <FiList className="text-brand-500 w-3.5 h-3.5" />
                </div>
                Course Modules
              </h3>
              <Button 
                onClick={() => setIsLessonModalOpen(true)}
                className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm flex items-center gap-2 px-5 font-black uppercase tracking-[0.15em] text-[10px] h-9 transition-all active:scale-95"
              >
                <FiPlus className="w-3.5 h-3.5" /> Establish New Module
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <Card key={lesson._id} className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm group hover:border-brand-500/30 transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-5">
                            <div className="bg-brand-500/10 text-brand-500 font-bold px-2 py-1 rounded-md text-[10px] border border-brand-500/20 uppercase tracking-widest group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                Week {lesson.week_number || '0'}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <FiCalendar className="w-3 h-3 text-brand-500" /> {new Date(lesson.date).toLocaleDateString()}
                                </span>
                                <button 
                                    onClick={(e) => handleDeleteLesson(lesson._id, e)}
                                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FiTrash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <h4 className="text-[16px] font-black text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors leading-tight mb-6">
                            {lesson.topic}
                        </h4>

                        <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-800/50">
                            {lesson.attached_file ? (
                              <a 
                                href={getFileUrl(lesson.attached_file)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-brand-500 hover:text-brand-600 transition-colors group/link"
                                onClick={(e) => e.stopPropagation()}
                              >
                                  <FiFileText className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">View Material</span>
                              </a>
                            ) : (
                              <div className="flex items-center gap-2 text-gray-400">
                                  <FiFileText className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">No Material</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-gray-300 dark:text-zinc-600 group-hover:translate-x-1 transition-transform">
                                <FiChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                    <EmptyState 
                        icon={<FiCalendar className="w-12 h-12 text-gray-200 dark:text-zinc-800" />}
                        title="No modules established"
                        description="Start by establishing lesson modules for this curriculum."
                        className="bg-white dark:bg-[#1E1E1E] border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl py-16 shadow-none"
                    />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <LessonFormModal 
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSubmit={handleCreateLesson}
      />

      <CourseFormModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        initialData={course}
        onSubmit={handleUpdateCourse}
      />
    </div>
  );
};

export default CourseDetail;
