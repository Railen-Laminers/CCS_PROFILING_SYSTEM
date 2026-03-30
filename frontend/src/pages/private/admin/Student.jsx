import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { userAPI } from '../../../services/api';
import { exportToExcel } from '../../../lib/excelHelper';
import { FiPlus, FiDownload } from 'react-icons/fi';
import StudentFormModal from '../../../components/forms/StudentFormModal';
import { useStudents } from '../../../hooks/useStudents';
import StudentFilters from '../../../components/filters/StudentFilters';
import StudentTable from '../../../components/tables/StudentTable';
import Pagination from '../../../components/ui/Pagination';

// Helper to format any date string into YYYY-MM-DD for date input
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
};

const StudentPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    // Custom logic hook
    const {
        students,
        loading,
        pagination,
        currentPage,
        setCurrentPage,
        tempSearchQuery,
        setTempSearchQuery,
        filters,
        setFilters,
        sports,
        organizations,
        isSearching,
        handleSearch,
        clearFilters,
        refresh,
        searchQuery
    } = useStudents();

    // Modal and Action state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [modalData, setModalData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [togglingUserId, setTogglingUserId] = useState(null);

    if (user?.role !== 'admin') {
        return <div className="p-6 text-red-500 dark:text-red-400">You do not have permission to view this page.</div>;
    }

    const handleAdd = () => {
        setModalMode('create');
        setModalData(null);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleEdit = (student) => {
        const s = student.student;
        setModalData({
            firstname: student.user.firstname,
            middlename: student.user.middlename || '',
            lastname: student.user.lastname,
            user_id: student.user.user_id,
            email: student.user.email,
            password: '',
            password_confirmation: '',
            birth_date: formatDateForInput(student.user.birth_date),
            contact_number: student.user.contact_number || '',
            gender: student.user.gender || '',
            address: student.user.address || '',
            is_active: student.user.is_active,
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
            sports_activities: s?.sports_activities || [],
            organizations: s?.organizations || [],
            behavior_discipline_records: s?.behavior_discipline_records || [],
            current_subjects: s?.current_subjects || [],
            academic_awards: s?.academic_awards || [],
            events_participated: s?.events_participated || [],
        });
        setEditingId(student.user.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = async (userId) => {
        const selectedStudent = students.find(s => s.user.id === userId);
        const studentName = `${selectedStudent?.user.firstname} ${selectedStudent?.user.lastname}`;
        if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) return;

        setDeletingUserId(userId);
        try {
            await userAPI.deleteUser(userId);
            refresh();
            showToast(`${studentName} deleted successfully.`, 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete student.', 'error');
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleToggleStatus = async (student) => {
        const newStatus = !student.user.is_active;
        const action = newStatus ? 'activate' : 'deactivate';
        if (!window.confirm(`Are you sure you want to ${action} ${student.user.firstname} ${student.user.lastname}?`)) return;

        setTogglingUserId(student.user.id);
        try {
            await userAPI.updateUser(student.user.id, { is_active: newStatus });
            refresh();
            showToast(`${student.user.firstname}'s status updated to ${newStatus ? 'Active' : 'Inactive'}.`, 'success');
        } catch (err) {
            showToast(err.response?.data?.message || `Failed to ${action} student.`, 'error');
        } finally {
            setTogglingUserId(null);
        }
    };

    const handleExport = () => {
        if (!students.length) return;

        const exportData = students.map(s => ({
            'Student ID': s.user.user_id,
            'Full Name': `${s.user.firstname} ${s.user.middlename ? s.user.middlename + ' ' : ''}${s.user.lastname}`,
            'Email': s.user.email,
            'Gender': s.user.gender || 'N/A',
            'Birth Date': s.user.birth_date ? s.user.birth_date.split('T')[0] : 'N/A',
            'Contact Number': s.user.contact_number ? `'${s.user.contact_number}` : 'N/A',
            'Address': s.user.address || 'N/A',
            'Program': s.student?.program || 'N/A',
            'Year Level': s.student?.year_level || 'N/A',
            'Section': s.student?.section || 'N/A',
            'GPA': s.student?.gpa || 'N/A',
            'Blood Type': s.student?.blood_type || 'N/A',
            'Status': s.user.is_active ? 'Active' : 'Inactive'
        }));

        const date = new Date().toISOString().split('T')[0];
        exportToExcel(exportData, `Student_Management_Report_${date}.xlsx`);
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Student Management</h1>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-surface-secondary shadow-sm transition-all active:scale-95 scroll-smooth"
                    >
                        <FiDownload className="w-4 h-4" /> Export Data
                    </button>
                    <button
                        onClick={handleAdd}
                        className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <FiPlus className="w-4 h-4" /> Add Student
                        </span>
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100 group-active:duration-75"></div>
                    </button>
                </div>
            </div>

            <StudentFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                initialData={modalData}
                userId={editingId}
                onSuccess={() => {
                    refresh();
                    showToast(`Student ${modalMode === 'create' ? 'created' : 'updated'} successfully.`, 'success');
                }}
            />

            <StudentFilters 
                tempSearchQuery={tempSearchQuery}
                setTempSearchQuery={setTempSearchQuery}
                handleSearch={handleSearch}
                isSearching={isSearching}
                filters={filters}
                setFilters={setFilters}
                sports={sports}
                organizations={organizations}
                clearFilters={clearFilters}
                searchQuery={searchQuery}
            />

            <StudentTable 
                students={students}
                loading={loading}
                navigate={navigate}
                handleToggleStatus={handleToggleStatus}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                togglingUserId={togglingUserId}
                deletingUserId={deletingUserId}
            />

            <Pagination 
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default StudentPage;
