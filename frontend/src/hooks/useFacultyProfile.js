import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { instructionAPI, userAPI } from '../services/api';

export const useFacultyProfile = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [instructorClasses, setInstructorClasses] = useState([]);
    const [assignedStudents, setAssignedStudents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || user.role !== 'faculty') return;
            setLoading(true);
            try {
                const classes = await instructionAPI.getClasses({ instructor_id: user.faculty?._id });
                setInstructorClasses(classes);
            } catch (err) {
                console.error('Failed to fetch faculty data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    return {
        user,
        loading,
        instructorClasses,
        assignedStudents,
    };
};

export default useFacultyProfile;