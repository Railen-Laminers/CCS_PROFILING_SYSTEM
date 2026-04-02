import { useState, useEffect } from 'react';
import { courseAPI, instructionAPI } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * Custom hook for CourseDetail data logic
 * Encapsulates data fetching, modal states, tab states, and server mutations.
 */
export const useCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); 

  // Modal states
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Standalone formatting helper
  const getFileUrl = (path) => {
    if (!path) return '#';
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const BASE_URL = API_BASE_URL.replace('/api', '');
    return `${BASE_URL}${path}`;
  };

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
      navigate('/instruction');
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
          course_id: id
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

  return {
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
  };
};
