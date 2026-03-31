import { useState, useMemo, useEffect } from 'react';
import { 
  FiBookOpen, 
  FiUsers, 
  FiFileText, 
  FiCalendar 
} from 'react-icons/fi';
import { instructionAPI } from '@/services/api';

const useInstruction = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classesData, assignmentsData, lessonPlansData, materialsData] = await Promise.all([
          instructionAPI.getClasses(),
          instructionAPI.getAssignments(),
          instructionAPI.getLessonPlans(),
          instructionAPI.getMaterials()
        ]);

        // Transform Classes
        const transformedClasses = classesData.map(cls => ({
          id: cls._id,
          courseCode: cls.course_id?.course_code || 'N/A',
          courseTitle: cls.course_id?.course_title || 'N/A',
          studentsCount: cls.students_count || 0,
          schedule: cls.schedule || 'STB',
          room: cls.room || 'TBA',
          instructor: cls.instructor_id?.user_id 
            ? `${cls.instructor_id.user_id.firstname} ${cls.instructor_id.user_id.lastname}`
            : 'Unknown'
        }));

        setClasses(transformedClasses);
        setAssignments(assignmentsData);
        setLessonPlans(lessonPlansData);
        setMaterials(materialsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching instruction data:', err);
        setError('Failed to load instruction data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = ['Classes', 'Assignments', 'Lesson Plans', 'Course Materials'];

  const statCards = [
    { 
      label: 'Active Classes', 
      icon: FiBookOpen, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100', 
      count: classes.length 
    },
    { 
      label: 'Total Students', 
      icon: FiUsers, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100', 
      count: classes.reduce((sum, cls) => sum + cls.studentsCount, 0) 
    },
    { 
      label: 'Open Assignments', 
      icon: FiFileText, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100', 
      count: assignments.filter(a => a.status === 'open').length 
    },
    { 
      label: 'Lesson Plans', 
      icon: FiCalendar, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100', 
      count: lessonPlans.length 
    },
  ];

  const filteredClasses = useMemo(() => {
    return classes.filter(cls => 
      cls.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [classes, searchQuery]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    tabs,
    statCards,
    filteredClasses,
    classes,
    assignments,
    lessonPlans,
    materials,
    loading,
    error
  };
};

export default useInstruction;
