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
  FiPlus
} from 'react-icons/fi';
import { courseAPI, instructionAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 0: Syllabus, 1: Lessons

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseData, allLessons] = await Promise.all([
          courseAPI.getCourse(id),
          instructionAPI.getLessonPlans()
        ]);
        
        setCourse(courseData);
        // Filter lessons for this course
        const courseLessons = allLessons.filter(lesson => 
          lesson.class_id?.course_id?._id === id || 
          lesson.class_id?.course_id === id
        );
        setLessons(courseLessons);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
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
          <Button onClick={() => navigate('/instruction')}>
            Back to Instruction
          </Button>
        }
      />
    );
  }

  const tabs = ['Syllabus', 'Lessons & Materials'];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Header / Breadcrumbs */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/instruction')}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors w-fit group"
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Curriculum
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-500 text-xs font-bold rounded-lg border border-brand-500/20 uppercase tracking-widest">
                {course.course_code}
              </span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                {course.year_level}{course.year_level === 1 ? 'st' : course.year_level === 2 ? 'nd' : course.year_level === 3 ? 'rd' : 'th'} Year • {course.semester === 1 ? 'First' : 'Second'} Sem
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {course.course_title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm flex items-center gap-2 px-6 rounded-xl font-bold uppercase tracking-widest text-xs h-11">
              <FiEdit3 className="w-4 h-4" /> Edit Details
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-800">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${
              activeTab === index 
                ? 'text-brand-500' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            {tab}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                      <FiLayers className="text-brand-500 w-4 h-4" />
                    </div>
                    Course Syllabus / Topics
                  </h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-600 dark:text-zinc-400 leading-relaxed font-mono text-sm bg-gray-50 dark:bg-[#18181B] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                      {course.syllabus || 'The detailed syllabus has not been uploaded yet.'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-brand-500 text-white border-none rounded-[2rem] shadow-lg shadow-brand-500/30 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <FiBook className="w-24 h-24" />
                </div>
                <CardContent className="p-8 relative z-10">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Academic Metrics</h3>
                  <div className="space-y-6 mt-4">
                    <div>
                      <p className="text-4xl font-black tabular-nums">{course.credits || course.units || 0}</p>
                      <p className="text-[11px] font-bold opacity-80 uppercase tracking-widest mt-1">Total Academic Units</p>
                    </div>
                    <div>
                      <p className="text-4xl font-black tabular-nums">{lessons.length}</p>
                      <p className="text-[11px] font-bold opacity-80 uppercase tracking-widest mt-1">Available Lesson Plans</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <CardContent className="p-6">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-5 ml-1 italic">Administrative Metadata</h4>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center bg-transparent">
                      <span className="text-[13px] font-medium text-gray-500 bg-transparent">System Entry</span>
                      <span className="text-[13px] font-bold text-gray-900 dark:text-gray-200 bg-transparent">{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-transparent">
                      <span className="text-[13px] font-medium text-gray-500 bg-transparent">Last Revision</span>
                      <span className="text-[13px] font-bold text-gray-900 dark:text-gray-200 bg-transparent">{new Date(course.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-transparent">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 bg-transparent">
                <FiList className="text-brand-500" /> Lesson Plans
              </h3>
              <Button className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm flex items-center gap-2 px-6 font-bold uppercase tracking-widest text-[11px] h-10">
                <FiPlus className="w-4 h-4" /> Add New Lesson
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <Card key={lesson._id} className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 group-hover:scale-110 transition-transform">
                            <FiCalendar className="text-brand-500 w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors leading-tight">
                              {lesson.topic}
                            </h4>
                            <div className="flex items-center gap-4 mt-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                              <span className="flex items-center gap-1.5"><FiClock className="w-3.5 h-3.5 text-brand-500" /> {new Date(lesson.date).toLocaleDateString()}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full" />
                              <span>Week {lesson.week_number || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="ghost" className="text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-[#2C2C2C] rounded-xl px-4 font-black text-[10px] uppercase tracking-[0.2em]">
                            Preview
                          </Button>
                          <Button className="bg-brand-500/10 text-brand-600 dark:text-brand-500 hover:bg-brand-500 hover:text-white border border-brand-500/20 rounded-xl px-6 font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <EmptyState 
                  icon={<FiCalendar className="w-16 h-16 text-gray-200 dark:text-zinc-800" />}
                  title="No lessons found"
                  description="You haven't defined any lesson plans for this course yet."
                  className="bg-gray-50/50 dark:bg-[#1a1a1b] border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] py-16"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
