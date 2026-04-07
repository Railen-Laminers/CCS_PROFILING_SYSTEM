import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { eventAPI, academicRecordAPI } from '../services/api';

export const useStudentProfile = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [scheduledEvents, setScheduledEvents] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [curricularEvents, setCurricularEvents] = useState([]);
    const [academicRecords, setAcademicRecords] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || user.role !== 'student') return;
            setLoading(true);
            try {
                const [allEvents, curricular, records] = await Promise.all([
                    eventAPI.getStudentEvents(user._id),
                    eventAPI.getStudentCurricularEvents(user._id),
                    academicRecordAPI.getAcademicRecords(user._id)
                ]);
                setRegisteredEvents(allEvents);
                setCurricularEvents(curricular);
                setAcademicRecords(records);
            } catch (err) {
                console.error('Failed to fetch student data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    return {
        user,
        loading,
        scheduledEvents,
        registeredEvents,
        curricularEvents,
        academicRecords,
    };
};

export default useStudentProfile;