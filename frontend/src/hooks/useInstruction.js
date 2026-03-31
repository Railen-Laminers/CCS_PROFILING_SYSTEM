import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  FiBookOpen, 
  FiUsers, 
  FiFileText, 
  FiCalendar 
} from 'react-icons/fi';
import { instructionAPI, courseAPI, userAPI } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';


const useInstruction = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [materials, setMaterials] = useState([]);
  
  // Selection Data
  const [allCourses, setAllCourses] = useState([]);
  const [allFaculty, setAllFaculty] = useState([]);

  // UI State
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [classesData, assignmentsData, lessonPlansData, materialsData, coursesData, facultyData] = await Promise.all([
        instructionAPI.getClasses(),
        instructionAPI.getAssignments(),
        instructionAPI.getLessonPlans(),
        instructionAPI.getMaterials(),
        courseAPI.getCourses(),
        userAPI.getFaculty()
      ]);

      // Transform Classes for the UI
      const transformedClasses = classesData.map(cls => ({
        id: cls._id,
        courseCode: cls.course_id?.course_code || 'N/A',
        courseTitle: cls.course_id?.course_title || 'N/A',
        studentsCount: cls.students_count || 0,
        schedule: cls.schedule || 'TBA',
        room: cls.room || 'TBA',
        instructor: cls.instructor_id?.user_id 
          ? `${cls.instructor_id.user_id.firstname} ${cls.instructor_id.user_id.lastname}`
          : 'Unknown',
        raw: cls // Keep original for editing
      }));

      setClasses(transformedClasses);
      setAssignments(assignmentsData);
      setLessonPlans(lessonPlansData);
      setMaterials(materialsData);
      setAllCourses(coursesData);
      setAllFaculty(facultyData);
    } catch (err) {
      console.error('Error fetching instruction data:', err);
      addToast('Failed to load dashboard data', 'error');
    } finally {

      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── CRUD Handlers ─────────────────────────────────────────────────────────

  const handleSave = async (type, data, id = null) => {
    try {
      let response;
      if (id) {
        // Update
        switch(type) {
          case 'class': response = await instructionAPI.updateClass(id, data); break;
          case 'assignment': response = await instructionAPI.updateAssignment(id, data); break;
          case 'lesson': response = await instructionAPI.updateLessonPlan(id, data); break;
          case 'material': response = await instructionAPI.updateMaterial(id, data); break;
          default: throw new Error('Invalid type');
        }
        addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`, 'success');
      } else {
        // Create
        switch(type) {
          case 'class': response = await instructionAPI.createClass(data); break;
          case 'assignment': response = await instructionAPI.createAssignment(data); break;
          case 'lesson': response = await instructionAPI.createLessonPlan(data); break;
          case 'material': response = await instructionAPI.createMaterial(data); break;
          default: throw new Error('Invalid type');
        }
        addToast(`New ${type} added successfully`, 'success');
      }
      
      await fetchData(); // Refresh data
      setIsFormOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(`Error saving ${type}:`, err);
      addToast(`Failed to save ${type}`, 'error');
    }
  };

  const handleDelete = async (type, id) => {
    try {
      switch(type) {
        case 'class': await instructionAPI.deleteClass(id); break;
        case 'assignment': await instructionAPI.deleteAssignment(id); break;
        case 'lesson': await instructionAPI.deleteLessonPlan(id); break;
        case 'material': await instructionAPI.deleteMaterial(id); break;
        default: throw new Error('Invalid type');
      }
      addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`, 'success');
      await fetchData();
      setIsConfirmOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      addToast(`Failed to delete ${type}`, 'error');
    }
  };


  // ─── Derived State ─────────────────────────────────────────────────────────

  const tabs = ['Classes', 'Assignments', 'Lesson Plans', 'Course Materials'];

  const statCards = [
    { label: 'Active Classes', icon: FiBookOpen, color: 'text-blue-600', bgColor: 'bg-blue-100', count: classes.length },
    { label: 'Total Students', icon: FiUsers, color: 'text-green-600', bgColor: 'bg-green-100', count: classes.reduce((sum, cls) => sum + cls.studentsCount, 0) },
    { label: 'Open Assignments', icon: FiFileText, color: 'text-orange-600', bgColor: 'bg-orange-100', count: assignments.filter(a => a.status === 'open').length },
    { label: 'Lesson Plans', icon: FiCalendar, color: 'text-purple-600', bgColor: 'bg-purple-100', count: lessonPlans.length },
  ];

  const filteredClasses = useMemo(() => {
    return classes.filter(cls => 
      cls.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [classes, searchQuery]);

  return {
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    tabs, statCards, filteredClasses,
    assignments, lessonPlans, materials,
    allCourses, allFaculty,
    loading,
    isFormOpen, setIsFormOpen,
    isConfirmOpen, setIsConfirmOpen,
    modalMode, setModalMode,
    selectedItem, setSelectedItem,
    handleSave, handleDelete,
    fetchData
  };
};

export default useInstruction;

