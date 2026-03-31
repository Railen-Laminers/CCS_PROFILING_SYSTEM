import { useState, useMemo } from 'react';
import { 
  FiBookOpen, 
  FiUsers, 
  FiFileText, 
  FiCalendar 
} from 'react-icons/fi';

const useInstruction = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes] = useState([]); // Initial empty state

  const tabs = ['Classes', 'Assignments', 'Lesson Plans', 'Course Materials'];

  const statCards = [
    { label: 'Active Classes', icon: FiBookOpen, color: 'text-blue-600', bgColor: 'bg-blue-100', count: 0 },
    { label: 'Total Students', icon: FiUsers, color: 'text-green-600', bgColor: 'bg-green-100', count: 0 },
    { label: 'Open Assignments', icon: FiFileText, color: 'text-orange-600', bgColor: 'bg-orange-100', count: 0 },
    { label: 'Lesson Plans', icon: FiCalendar, color: 'text-purple-600', bgColor: 'bg-purple-100', count: 0 },
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
    classes
  };
};

export default useInstruction;
