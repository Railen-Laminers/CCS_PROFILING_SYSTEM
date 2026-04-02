import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useReactToPrint } from 'react-to-print';
import { userAPI, instructionAPI, facultyProfileAPI } from '../services/api';
import { formatDateForInput } from './useStudentDetails';

export const useFacultyDetails = () => {
    const { id } = useParams();
    const { showToast } = useToast();
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [instructorClasses, setInstructorClasses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);

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
            setFaculty(data);
            
            // Fetch classes for this instructor
            if (data.faculty?._id) {
                const classes = await instructionAPI.getClasses({ instructor_id: data.faculty._id });
                setInstructorClasses(classes);
            }

            // Fetch metadata for the edit modal
            const [deptData, posData] = await Promise.all([
                facultyProfileAPI.getDepartments(),
                facultyProfileAPI.getPositions()
            ]);
            setDepartments(deptData.departments || []);
            setPositions(posData.positions || []);

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
        setModalData(faculty);
        setModalOpen(true);
    };

    const handleTabChange = async (tab) => {
        if (tab === activeTab) return;
        setIsTabLoading(true);
        setActiveTab(tab);
        setTimeout(() => setIsTabLoading(false), 300);
    };

    // Derived statistics and formatted data
    const teachingSchedule = instructorClasses.map(cls => ({
        id: cls._id,
        display: `${cls.course_id?.course_code} - ${cls.schedule.date} at ${cls.schedule.startTime}-${cls.schedule.endTime} (${cls.room_id?.name || 'Unknown Room'})`,
        course: cls.course_id?.course_code
    }));

    const subjectsHandled = [...new Set(instructorClasses.map(cls => cls.course_id?.course_code))].filter(Boolean);

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
        teachingSchedule,
        subjectsHandled,
        instructorClasses,
        departments,
        positions,
    };
};
