import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useReactToPrint } from 'react-to-print';
import { userAPI, academicRecordAPI } from '../services/api';

// Helper to format any date string into YYYY-MM-DD for date input
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
};

export const useStudentDetails = () => {
    const { id } = useParams();
    const { showToast } = useToast();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [activeTab, setActiveTab] = useState('Student Information');
    const [isTabLoading, setIsTabLoading] = useState(false);

    // Academic Record States
    const [academicRecords, setAcademicRecords] = useState([]);
    const [isAcademicLoading, setIsAcademicLoading] = useState(false);
    const [academicError, setAcademicError] = useState('');
    const [curricularEvents, setCurricularEvents] = useState([]);
    const [isCurricularLoading, setIsCurricularLoading] = useState(false);
    const [allParticipatedEvents, setAllParticipatedEvents] = useState([]);
    const [isAllEventsLoading, setIsAllEventsLoading] = useState(false);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    // Printing
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Student_Profile_${student?.user_id || 'Report'}`,
    });

    const handlePrintRequest = () => {
        if (!student) return;
        handlePrint();
    };

    const fetchStudent = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await userAPI.getUser(id);
            setStudent(data);

            // Pre-fetch academic records for the printable report
            try {
                const records = await academicRecordAPI.getAcademicRecords(id);
                setAcademicRecords(records);
            } catch (err) {
                console.warn('Background fetch of academic records failed:', err);
            }
        } catch (err) {
            console.error(err);
            showToast('Failed to fetch student details.', 'error');
            setError('Failed to fetch student details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const handleEdit = () => {
        if (!student) return;
        const s = student.student;
        setModalData({
            firstname: student.firstname,
            middlename: student.middlename || '',
            lastname: student.lastname,
            user_id: student.user_id,
            email: student.email,
            password: '',
            password_confirmation: '',
            birth_date: formatDateForInput(student.birth_date),
            contact_number: student.contact_number || '',
            gender: student.gender || '',
            address: student.address || '',
            is_active: student.is_active,
            parent_guardian_name: s?.parent_guardian_name || '',
            emergency_contact: s?.emergency_contact || '',
            section: s?.section || '',
            program: s?.program || '',
            year_level: s?.year_level || '',
            gpa: s?.gpa || '',
            blood_type: s?.blood_type || '',
            disabilities: s?.disabilities || '',
            medical_condition: s?.medical_condition || '',
            allergies: s?.allergies || '',
            sports_activities: Array.isArray(s?.sports_activities) ? s.sports_activities.join(', ') : s?.sports_activities || '',
            organizations: Array.isArray(s?.organizations) ? s.organizations.join(', ') : s?.organizations || '',
            behavior_discipline_records: Array.isArray(s?.behavior_discipline_records) ? s.behavior_discipline_records.join(', ') : s?.behavior_discipline_records || '',
            current_subjects: Array.isArray(s?.current_subjects) ? s.current_subjects.join(', ') : '',
            academic_awards: Array.isArray(s?.academic_awards) ? s.academic_awards.join(', ') : '',
            events_participated: Array.isArray(s?.events_participated) ? s.events_participated.join(', ') : '',
        });
        setModalOpen(true);
    };

    const handleTabChange = async (tab) => {
        if (tab === activeTab) return;
        setIsTabLoading(true);
        setActiveTab(tab);

        // Fetch academic records when clicking the tab if not already fetched
        if (tab === 'Academic Record') {
            if (academicRecords.length === 0) {
                setIsAcademicLoading(true);
                setAcademicError('');
                try {
                    const records = await academicRecordAPI.getAcademicRecords(id);
                    setAcademicRecords(records);
                } catch (err) {
                    console.error(err);
                    showToast('Failed to load academic records.', 'error');
                    setAcademicError('Failed to load academic records.');
                } finally {
                    setIsAcademicLoading(false);
                }
            }

            // Always refresh curricular events to stay up-to-date
            setIsCurricularLoading(true);
            try {
                const { eventAPI } = await import('../services/api');
                const events = await eventAPI.getStudentCurricularEvents(id);
                setCurricularEvents(events);
            } catch (err) {
                console.warn('Failed to load curricular events:', err);
            } finally {
                setIsCurricularLoading(false);
            }
        }

        // Fetch all participations when Events & Competitions tab is active
        if (tab === 'Events & Competitions') {
            setIsAllEventsLoading(true);
            try {
                const { eventAPI } = await import('../services/api');
                const events = await eventAPI.getStudentEvents(id);
                setAllParticipatedEvents(events);
            } catch (err) {
                console.warn('Failed to load all student events:', err);
            } finally {
                setIsAllEventsLoading(false);
            }
        }

        setTimeout(() => setIsTabLoading(false), 300);
    };

    return {
        student,
        loading,
        error,
        activeTab,
        isTabLoading,
        academicRecords,
        isAcademicLoading,
        academicError,
        curricularEvents,
        isCurricularLoading,
        allParticipatedEvents,
        isAllEventsLoading,
        modalOpen,
        setModalOpen,
        modalData,
        componentRef,
        handlePrintRequest,
        handleEdit,
        handleTabChange,
        fetchStudent,
        showToast,
    };
};
