import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useReactToPrint } from 'react-to-print';
import { userAPI } from '../services/api';
import { formatDateForInput } from './useStudentDetails';

export const useFacultyDetails = () => {
    const { id } = useParams();
    const { showToast } = useToast();
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [activeTab, setActiveTab] = useState('Personal Information');
    const [isTabLoading, setIsTabLoading] = useState(false);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    // Printing
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Faculty_Profile_${faculty?.user?.user_id || 'Report'}`,
    });

    const handlePrintRequest = () => {
        if (!faculty) return;
        handlePrint();
    };

    const fetchFaculty = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await userAPI.getUser(id);
            // The backend returns { user: {...}, faculty: {...} } or just the user object with faculty nested
            // Based on previous Faculty.jsx logic, it seems it expects the whole object
            setFaculty(data);
        } catch (err) {
            console.error(err);
            showToast('Failed to fetch faculty details.', 'error');
            setError('Failed to fetch faculty details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaculty();
    }, [id]);

    const handleEdit = () => {
        if (!faculty) return;
        const f = faculty.faculty;
        const u = faculty.user || faculty; // Handle both nested and flat structures if API differs
        
        setModalData({
            firstname: u.firstname,
            middlename: u.middlename || '',
            lastname: u.lastname,
            user_id: u.user_id,
            email: u.email,
            password: '',
            password_confirmation: '',
            birth_date: formatDateForInput(u.birth_date),
            contact_number: u.contact_number || '',
            gender: u.gender || '',
            address: u.address || '',
            is_active: u.is_active,
            department: f?.department || '',
            position: f?.position || '',
            specialization: f?.specialization || '',
            subjects_handled: Array.isArray(f?.subjects_handled) ? f.subjects_handled.join(', ') : f?.subjects_handled || '',
            teaching_schedule: Array.isArray(f?.teaching_schedule) ? f.teaching_schedule.join(', ') : f?.teaching_schedule || '',
            research_projects: Array.isArray(f?.research_projects) ? f.research_projects.join(', ') : f?.research_projects || '',
        });
        setModalOpen(true);
    };

    const handleTabChange = async (tab) => {
        if (tab === activeTab) return;
        setIsTabLoading(true);
        setActiveTab(tab);
        setTimeout(() => setIsTabLoading(false), 300);
    };

    return {
        faculty,
        loading,
        error,
        activeTab,
        isTabLoading,
        modalOpen,
        setModalOpen,
        modalData,
        componentRef,
        handlePrintRequest,
        handleEdit,
        handleTabChange,
        fetchFaculty,
        showToast,
    };
};
