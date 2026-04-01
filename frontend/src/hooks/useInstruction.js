import { useState, useMemo, useEffect } from 'react';
import { 
  FiBookOpen, 
  FiUsers, 
  FiFileText, 
  FiCalendar 
} from 'react-icons/fi';
import { instructionAPI, courseAPI } from '@/services/api';

const useInstruction = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const coursesData = await courseAPI.getCourses();
      setCourses(coursesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching instruction data:', err);
      setError('Failed to load curriculum data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const curriculum = useMemo(() => {
    const grouped = {
      1: { 1: [], 2: [] },
      2: { 1: [], 2: [] },
      3: { 1: [], 2: [] },
      4: { 1: [], 2: [] }
    };

    courses.forEach(course => {
      if (grouped[course.year_level]) {
        grouped[course.year_level][course.semester].push(course);
      }
    });

    return grouped;
  }, [courses]);

  return {
    curriculum,
    loading,
    error,
    refresh: fetchData
  };
};

export default useInstruction;
