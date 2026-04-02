import { useState, useMemo, useEffect } from 'react';
import { 
  FiBookOpen, 
  FiUsers, 
  FiFileText, 
  FiCalendar 
} from 'react-icons/fi';
import { instructionAPI, courseAPI } from '@/services/api';

const useInstruction = (program = 'BSIT') => {
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

    if (Array.isArray(courses)) {
      courses.filter(c => !c.program || c.program === program).forEach(course => {
        const yr = course.year_level;
        const sem = course.semester;

        if (grouped[yr]) {
          if (!grouped[yr][sem]) {
            grouped[yr][sem] = [];
          }
          grouped[yr][sem].push(course);
        }
      });
    }

    return grouped;
  }, [courses, program]);

  return {
    curriculum,
    loading,
    error,
    refresh: fetchData
  };
};

export default useInstruction;
