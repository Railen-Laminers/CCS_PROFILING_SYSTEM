import { useState, useEffect } from 'react';
import { userAPI, courseAPI, eventAPI } from '../services/api';

const useDashboardStats = (userRole) => {
    const [studentCount, setStudentCount] = useState(null);
    const [facultyCount, setFacultyCount] = useState(null);
    const [courseCount, setCourseCount] = useState(null);
    const [eventCount, setEventCount] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCounts = async () => {
            if (userRole !== 'admin') return;

            setLoading(true);
            try {
                const students = await userAPI.getStudents();
                const faculty = await userAPI.getFaculty();
                const courses = await courseAPI.getCourses();
                const events = await eventAPI.getEvents();
                setStudentCount(students.length);
                setFacultyCount(faculty.length);
                setCourseCount(courses.length);
                setEventCount(events.length);
            } catch (error) {
                console.error('Failed to fetch counts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, [userRole]);

    return {
        studentCount,
        facultyCount,
        courseCount,
        eventCount,
        loading,
    };
};

export default useDashboardStats;
