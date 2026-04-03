import React from 'react';
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
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import LessonFormModal from '@/components/forms/LessonFormModal';
import CourseFormModal from '@/components/forms/CourseFormModal';

const CourseDetail = () => {
  const {
    course,
    lessons,
    loading,
    activeTab,
    setActiveTab,
    isLessonModalOpen,
    setIsLessonModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    getFileUrl,
    handleDeleteCourse,
    handleUpdateCourse,
    handleCreateLesson,
    handleDeleteLesson,
    navigate
  } = useCourseDetail();

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
        icon={FiBook}
        title="Course not found"
        description="The course you are looking for does not exist or has been removed."
        action={{
          label: "Back to Curriculum",
          onClick: () => navigate('/instruction')
        }}
      />
    );
  }

  const tabs = ['Syllabus Breakdown', 'Lessons & Materials'];

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header / Back */}
      <button 
          onClick={() => navigate('/instruction')}
          className="group flex items-center gap-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-all duration-200 focus:outline-none"
      >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-[#252525] group-hover:-translate-x-1 transition-all duration-200 flex-shrink-0">
              <FiArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
          <span className="group-hover:underline decoration-gray-400 dark:decoration-gray-600 underline-offset-4 tracking-tight">Back to Curriculum</span>
      </button>

      {/* Profile Overview Card */}
      <Card className="p-6 mb-6 bg-white dark:bg-[#1E1E1E] rounded-[1rem] shadow-sm border border-gray-200 dark:border-gray-800 transition-all overflow-hidden relative">
          <div className="absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/80 dark:ring-white/5 pointer-events-none"></div>
          <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-6 relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-[120px] h-[120px] rounded-[32px] bg-gradient-to-br from-brand-500 to-indigo-500 text-white flex items-center justify-center text-5xl font-bold shadow-xl flex-shrink-0 ring-4 ring-white dark:ring-[#1E1E1E] hover:rotate-3 transition-transform duration-300">
                      <FiBook className="w-12 h-12" />
                  </div>
                  <div className="text-left">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight leading-tight">{course.course_title}</h1>
                      <p className="text-base font-medium text-gray-500 dark:text-gray-400 mb-4">{course.course_code}</p>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
                              {course.year_level}{course.year_level === 1 ? 'st' : course.year_level === 2 ? 'nd' : course.year_level === 3 ? 'rd' : 'th'} Year Level
                          </span>
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
                              {course.semester === 1 ? '1st' : '2nd'} Semester
                          </span>
                          <span className="bg-[#00C950]/10 text-[#00C950] border border-[#00C950]/20 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
                              {course.units} Units
                          </span>
                      </div>
                      <div className="flex items-center flex-wrap gap-x-10 gap-y-3 mt-6 text-sm text-gray-600 dark:text-gray-400 font-normal">
                          <div className="flex items-center gap-2.5">
                              <FiList className="w-4 h-4 text-brand-500" /> 
                              <span>{lessons.length} Modules</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                              <FiCalendar className="w-4 h-4 text-brand-500" /> 
                              <span>Added {new Date(course.createdAt).toLocaleDateString()}</span>
                          </div>
                      </div>
                  </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <Button 
                      variant="secondary" 
                      className="flex-1 md:flex-none gap-2 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 border transition-all dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 dark:border-red-500/20 shadow-sm"
                      onClick={handleDeleteCourse}
                  >
                      <FiTrash2 className="w-4 h-4" /> Delete
                  </Button>
                  <Button variant="primary" className="flex-1 md:flex-none gap-2 bg-brand-500 hover:bg-brand-600 text-white shadow-sm font-semibold" onClick={() => setIsEditModalOpen(true)}>
                      <FiEdit3 className="w-4 h-4" /> Edit Course
                  </Button>
              </div>
          </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex space-x-2 mb-6 overflow-x-auto p-2 bg-gray-100 dark:bg-[#252525] rounded-[1.25rem] border border-gray-200 dark:border-gray-800 scrollbar-hide shadow-inner relative overflow-hidden">
          {tabs.map((tab, index) => (
              <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all rounded-[1.25rem] relative z-10 focus:outline-none ${activeTab === index 
                          ? 'bg-white dark:bg-[#1E1E1E] text-brand-600 dark:text-brand-500 shadow-sm ring-1 ring-zinc-200 dark:ring-white/10 backdrop-blur-md' 
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-[#2C2C2C]'
                  }`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* Tab Content Rendering */}
      <Card className="p-6 bg-white dark:bg-[#1E1E1E] rounded-[1rem] shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/80 dark:ring-white/5 pointer-events-none"></div>
          <div className="animate-in fade-in duration-300 text-left">
              
              {activeTab === 0 && (
                  <div className="space-y-6">
                      <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                          <div className="flex items-center gap-2 mb-6 text-brand-500">
                              <FiFileText className="w-5 h-5" />
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Attached Syllabus Document</h3>
                          </div>
                          {course.syllabus_file ? (
                              <div className="flex items-center justify-between p-5 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-[1rem] shadow-sm shadow-black/5">
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-[1rem] bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                                          <FiFileText className="text-brand-500 w-5 h-5" />
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Course Syllabus</p>
                                          <p className="text-xs text-gray-500 font-medium mt-0.5" title={course.syllabus_file.split('/').pop()}>
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
                                      className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                                  >
                                      View Document
                                  </a>
                              </div>
                          ) : (
                              <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-[#1E1E1E] border border-dashed border-gray-300 dark:border-gray-700 rounded-[1rem]">
                                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                      <FiFileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                  </div>
                                  <p className="text-sm font-bold text-gray-600 dark:text-gray-300">No Syllabus File Attached</p>
                                  <p className="text-xs text-gray-400 mt-1">Edit course to upload a document</p>
                              </div>
                          )}
                      </div>
                  </div>
              )}

              {activeTab === 1 && (
                  <div className="space-y-6">
                      <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                          <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-2 text-brand-500">
                                  <FiList className="w-5 h-5" />
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Curriculum Modules</h3>
                              </div>
                              <Button 
                                  onClick={() => setIsLessonModalOpen(true)}
                                  variant="primary"
                                  className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm flex items-center gap-2 h-9 px-4 text-xs font-semibold"
                              >
                                  <FiPlus className="w-4 h-4" /> Establish Module
                              </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                              {lessons.length > 0 ? (
                                  lessons.map((lesson) => (
                                      <Card key={lesson._id} className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm shadow-black/5 group hover:border-brand-500/30 transition-all duration-300">
                                          <CardContent className="p-5">
                                              <div className="flex justify-between items-start mb-4">
                                                  <div className="bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold px-2.5 py-1 rounded-md text-xs border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                                      Week {lesson.week_number || '0'}
                                                  </div>
                                                  <div className="flex items-center gap-3">
                                                      <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                          <FiCalendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover:text-brand-500 transition-colors" /> {new Date(lesson.date).toLocaleDateString()}
                                                      </span>
                                                      <button 
                                                          onClick={(e) => handleDeleteLesson(lesson._id, e)}
                                                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                      >
                                                          <FiTrash2 className="w-4 h-4" />
                                                      </button>
                                                  </div>
                                              </div>

                                              <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors leading-tight mb-5 line-clamp-2 min-h-[40px]">
                                                  {lesson.topic}
                                              </h4>

                                              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                                  {lesson.attached_file ? (
                                                      <a 
                                                          href={getFileUrl(lesson.attached_file)}
                                                          target="_blank"
                                                          rel="noreferrer"
                                                          className="flex items-center gap-2 text-brand-500 hover:text-brand-600 font-semibold text-sm transition-colors group/link"
                                                          onClick={(e) => e.stopPropagation()}
                                                      >
                                                          <FiFileText className="w-4 h-4" />
                                                          <span>View Material</span>
                                                      </a>
                                                  ) : (
                                                      <div className="flex items-center gap-2 text-gray-400 font-medium text-sm">
                                                          <FiFileText className="w-4 h-4" />
                                                          <span>No Material</span>
                                                      </div>
                                                  )}
                                                  <div className="flex items-center gap-1 text-gray-300 dark:text-zinc-600 group-hover:translate-x-1 group-hover:text-brand-500 transition-all">
                                                      <FiChevronRight className="w-4 h-4" />
                                                  </div>
                                              </div>
                                          </CardContent>
                                      </Card>
                                  ))
                              ) : (
                                  <div className="col-span-full">
                                      <EmptyState 
                                          size="md"
                                          icon={FiList}
                                          title="No modules established"
                                          description="Start by establishing lesson modules for this curriculum."
                                      />
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </Card>

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
