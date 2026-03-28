import { useState, useEffect } from 'react';
import { userAPI, courseAPI, eventAPI } from '../services/api';

const useDashboardStats = (userRole) => {
    const [studentCount, setStudentCount] = useState(null);
    const [facultyCount, setFacultyCount] = useState(null);
    const [courseCount, setCourseCount] = useState(null);
    const [eventCount, setEventCount] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchCounts = async () => {
            if (userRole !== 'admin') return;

            setLoading(true);
            try {
                const [students, faculty, courses, events] = await Promise.all([
                    userAPI.getStudents(signal),
                    userAPI.getFaculty(signal),
                    courseAPI.getCourses(signal),
                    eventAPI.getEvents(signal)
                ]);

                setStudentCount(students.length);
                setFacultyCount(faculty.length);
                setCourseCount(courses.length);
                setEventCount(events.length);
            } catch (error) {
                if (error.name === 'CanceledError' || error.name === 'AbortError') {
                    // Ignore cancellation errors
                    return;
                }
                console.error('Failed to fetch counts:', error);
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchCounts();

        return () => {
            controller.abort();
        };
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
