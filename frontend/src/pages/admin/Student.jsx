import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import StudentFormModal from '../../components/StudentFormModal';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiEyeOff,
    FiSave,
    FiX,
    FiDownload,
    FiSearch,
    FiUsers,
    FiPower,           
} from 'react-icons/fi';

const Spinner = () => (
    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-[#F97316] border-t-transparent"></div>
);

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
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [deletingUserId, setDeletingUserId] = useState(null);
    const [togglingUserId, setTogglingUserId] = useState(null);   // ✅ For status toggle

    // Form Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [modalData, setModalData] = useState(null);
    const [editingId, setEditingId] = useState(null);

    if (user?.role !== 'admin') {
        return <div className="p-6 text-red-500 dark:text-red-400">You do not have permission to view this page.</div>;
    }



    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getStudents();
            setStudents(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch students.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);



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
            sports_activities: Array.isArray(s?.sports_activities) ? s.sports_activities.join(', ') : s?.sports_activities || '',
            organizations: Array.isArray(s?.organizations) ? s.organizations.join(', ') : s?.organizations || '',
            behavior_discipline_records: Array.isArray(s?.behavior_discipline_records) ? s.behavior_discipline_records.join(', ') : s?.behavior_discipline_records || '',
            current_subjects: Array.isArray(s?.current_subjects) ? s.current_subjects.join(', ') : '',
            academic_awards: Array.isArray(s?.academic_awards) ? s.academic_awards.join(', ') : '',
            events_participated: Array.isArray(s?.events_participated) ? s.events_participated.join(', ') : '',
        });
        setEditingId(student.user.id);
        setModalMode('edit');
        setModalOpen(true);
    };



    const handleDelete = async (userId) => {
        const selectedStudent = students.find(s => s.user.id === userId);
        const studentName = `${selectedStudent?.user.firstname} ${selectedStudent?.user.lastname}`;
        if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) return;

        setDeletingUserId(userId);
        setError('');
        try {
            await userAPI.deleteUser(userId);
            await fetchStudents();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete student.');
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleToggleStatus = async (student) => {
        const newStatus = !student.user.is_active;
        const action = newStatus ? 'activate' : 'deactivate';
        if (!window.confirm(`Are you sure you want to ${action} ${student.user.firstname} ${student.user.lastname}?`)) return;

        setTogglingUserId(student.user.id);
        setError('');
        try {
            await userAPI.updateUser(student.user.id, { is_active: newStatus });
            await fetchStudents();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${action} student.`);
        } finally {
            setTogglingUserId(null);
        }
    };



    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Student Management</h1>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <FiDownload className="w-4 h-4" /> Export Data
                    </button>
                    <button
                        onClick={() => {
                            setModalMode('create');
                            setModalData(null);
                            setModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
                    >
                        <FiPlus className="w-4 h-4" /> Add Student
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <StudentFormModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                mode={modalMode} 
                initialData={modalData}
                userId={editingId}
                onSuccess={fetchStudents} 
            />

            {/* Search Bar */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
                <div className="relative w-full">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5 pointer-events-none" />
                    <input type="text" placeholder="Search by name, student ID, or course..." className="w-full h-10 pl-11 pr-4 bg-[#F3F3F5] dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                {loading ? (
                    <div className="flex justify-center items-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F97316]"></div></div>
                ) : students.length === 0 ? (
                    <div className="text-center py-16 text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center"><FiUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" /><p>No students found in the database.</p></div>
                ) : (
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[7%]">Photo</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[12%]">Student ID</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[18%]">Name</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[18%]">Program</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[10%]">Year Level</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[10%]">Section</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[10%]">Status</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide text-left w-[15%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {students.map((student) => {
                                    const fullName = [student.user.firstname, student.user.middlename, student.user.lastname].filter(Boolean).join(' ');
                                    const initials = student.user.firstname?.[0] || 'S';
                                    const isActive = student.user.is_active;
                                    return (
                                        <tr 
                                            key={student.user.id} 
                                            onClick={() => navigate(`/students/${student.user.id}`)}
                                            className="hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors h-[60px] cursor-pointer group"
                                        >
                                            <td className="py-2 px-1 pr-4 whitespace-nowrap">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[12px] font-bold shadow-inner">
                                                    {initials}
                                                </div>
                                            </td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-900 dark:text-gray-100 font-medium">{student.user.user_id}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-gray-300">{fullName}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-gray-300">{student.student?.program || 'N/A'}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-gray-300">{student.student?.year_level ? `${student.student.year_level} Year` : 'N/A'}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-gray-300">{student.student?.section || 'N/A'}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-[9px] text-[12px] font-medium ${isActive ? 'bg-[#00C950] text-[#fff]' : 'bg-gray-300 text-gray-700'}`}>
                                                    {isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-2 px-1 whitespace-nowrap text-left" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-start gap-3 items-center">
                                                    <button
                                                        onClick={() => handleToggleStatus(student)}
                                                        className={`p-1.5 rounded-md transition-colors ${isActive ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20' : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'}`}
                                                        title={isActive ? 'Deactivate' : 'Activate'}
                                                        disabled={togglingUserId !== null}
                                                    >
                                                        {togglingUserId === student.user.id ? <Spinner /> : <FiPower className="w-[18px] h-[18px]" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(student)}
                                                        className="text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-500/10 transition-colors p-1.5 rounded-md"
                                                        title="Edit Student"
                                                        disabled={togglingUserId !== null || deletingUserId !== null}
                                                    >
                                                        <FiEdit2 className="w-[18px] h-[18px] stroke-[1.5]" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(student.user.id)}
                                                        className={`p-1.5 rounded-md transition-colors ${isActive ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20'}`}
                                                        title={isActive ? 'Must deactivate before deletion' : 'Delete Student'}
                                                        disabled={isActive || deletingUserId !== null || togglingUserId !== null}
                                                    >
                                                        {deletingUserId === student.user.id ? <Spinner /> : <FiTrash2 className="w-[18px] h-[18px] stroke-[1.5]" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentPage;