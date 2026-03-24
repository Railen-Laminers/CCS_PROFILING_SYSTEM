import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiEyeOff,
    FiSave,
    FiX,
    FiDownload,
    FiSearch
} from 'react-icons/fi';

const Spinner = () => (
    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
);

const StudentPage = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form state
    const [formMode, setFormMode] = useState('create');
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        user_id: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (user?.role !== 'admin') {
        return <div className="p-6 text-red-500 dark:text-red-400">You do not have permission to view this page.</div>;
    }

    const getErrorMessage = (err) => {
        if (err.response?.data?.errors) {
            const firstError = Object.values(err.response.data.errors)[0]?.[0];
            return firstError;
        }
        if (err.response?.data?.message) return err.response.data.message;
        return null;
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getStudents();
            setStudents(data);
            setError('');
        } catch (err) {
            setError(getErrorMessage(err) || 'Failed to fetch students.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            firstname: '',
            middlename: '',
            lastname: '',
            user_id: '',
            email: '',
            password: '',
            password_confirmation: '',
        });
        setEditingId(null);
        setFormMode('create');
        setShowForm(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const validatePasswords = () => {
        if (formMode === 'create') {
            if (formData.password !== formData.password_confirmation) {
                setError('Passwords do not match.');
                return false;
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                setError('Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number.');
                return false;
            }
        } else if (formMode === 'edit' && formData.password) {
            if (formData.password !== formData.password_confirmation) {
                setError('Passwords do not match.');
                return false;
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                setError('Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number.');
                return false;
            }
        }
        return true;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!validatePasswords()) return;
        setIsCreating(true);
        setError('');
        try {
            const newStudent = await userAPI.createUser({
                firstname: formData.firstname,
                middlename: formData.middlename,
                lastname: formData.lastname,
                user_id: formData.user_id,
                email: formData.email,
                password: formData.password,
                role: 'student',
            });
            setStudents((prev) => [...prev, newStudent]);
            resetForm();
        } catch (err) {
            setError(getErrorMessage(err) || 'Failed to create student.');
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleEdit = (student) => {
        setFormData({
            firstname: student.firstname,
            middlename: student.middlename || '',
            lastname: student.lastname,
            user_id: student.user_id,
            email: student.email,
            password: '',
            password_confirmation: '',
        });
        setEditingId(student.id);
        setFormMode('edit');
        setShowForm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!validatePasswords()) return;
        setIsUpdating(true);
        setError('');
        try {
            const updateData = {
                firstname: formData.firstname,
                middlename: formData.middlename,
                lastname: formData.lastname,
                user_id: formData.user_id,
                email: formData.email,
            };
            if (formData.password) updateData.password = formData.password;
            const updatedStudent = await userAPI.updateUser(editingId, updateData);
            setStudents((prev) =>
                prev.map((s) => (s.id === editingId ? updatedStudent : s))
            );
            resetForm();
        } catch (err) {
            setError(getErrorMessage(err) || 'Failed to update student.');
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        setIsDeleting(true);
        setError('');
        try {
            await userAPI.deleteUser(id);
            setStudents((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            setError(getErrorMessage(err) || 'Failed to delete student.');
            console.error(err);
        } finally {
            setIsDeleting(false);
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
                            resetForm();
                            setShowForm(true);
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

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold dark:text-white">
                                {formMode === 'create' ? 'Add Student' : 'Edit Student'}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={formMode === 'create' ? handleCreate : handleUpdate} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name *</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Middle Name</label>
                                <input
                                    type="text"
                                    name="middlename"
                                    value={formData.middlename}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name *</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">User ID (7 digits) *</label>
                                <input
                                    type="text"
                                    name="user_id"
                                    value={formData.user_id}
                                    onChange={handleInputChange}
                                    required
                                    pattern="\d{7}"
                                    title="Must be exactly 7 digits"
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password {formMode === 'create' ? '*' : '(leave blank to keep current)'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required={formMode === 'create'}
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 pr-10 dark:bg-gray-700 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {formMode === 'create' && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Must be at least 8 characters, contain uppercase, lowercase, and number.
                                    </p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Password {formMode === 'create' ? '*' : '(if changing)'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        required={formMode === 'create'}
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 pr-10 dark:bg-gray-700 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                    disabled={isCreating || isUpdating}
                                >
                                    <FiX className="w-4 h-4" /> Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-orange-600 flex items-center gap-2 shadow-sm disabled:opacity-50"
                                    disabled={isCreating || isUpdating}
                                >
                                    {(isCreating || isUpdating) && <Spinner />}
                                    <FiSave className="w-4 h-4" />
                                    {formMode === 'create' ? (isCreating ? 'Creating...' : 'Create') : (isUpdating ? 'Updating...' : 'Update')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Action Bar / Search Container */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
                <div className="relative w-full">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5 pointer-events-none" />
                    <input 
                        type="text"
                        placeholder="Search by name, student ID, or course..."
                        className="w-full h-10 pl-11 pr-4 bg-[#F3F3F5] dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                    />
                </div>
            </div>

            {/* Students Table Container */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F97316]"></div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-16 text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center">
                        <FiUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                        <p>No students found in the database.</p>
                    </div>
                ) : (
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[5%]">Photo</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[12%]">Student ID</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[25%]">Name</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[25%]">Course</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[10%]">Year Level</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[8%]">Section</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide w-[10%]">Status</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200 tracking-wide text-left w-[5%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {students.map((student) => {
                                    const fullName = [student.firstname, student.middlename, student.lastname].filter(Boolean).join(' ');
                                    const initials = student.firstname?.[0] || 'S';
                                    return (
                                        <tr key={student.id} className="hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors h-[60px]">
                                            <td className="py-2 px-1 pr-4 whitespace-nowrap">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[12px] font-bold shadow-inner">
                                                    {initials}
                                                </div>
                                            </td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-900 dark:text-gray-100 font-medium">
                                                {student.user_id}
                                            </td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-gray-300">
                                                {fullName}
                                            </td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-gray-300">
                                                BS Computer Science
                                            </td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-gray-300">
                                                1st Year
                                            </td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-gray-300">
                                                A
                                            </td>
                                            <td className="py-2 pr-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-[9px] text-[12px] font-medium bg-[#00C950] dark:bg-[#00C950] text-[#fff] dark:text-[#171717] border border-green-500/10">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="py-2 whitespace-nowrap text-left">
                                                <div className="flex justify-start gap-3 items-center">
                                                    <button className="text-[#F97316] hover:text-orange-600 p-1.5 rounded-md" title="View Logs">
                                                        <FiEye className="w-[18px] h-[18px] stroke-[1.5]" />
                                                    </button>
                                                    <button onClick={() => handleEdit(student)} className="text-blue-500 hover:text-blue-600 transition-colors p-1.5 rounded-md" title="Edit Student" disabled={isDeleting}>
                                                        <FiEdit2 className="w-[18px] h-[18px] stroke-[1.5]" />
                                                    </button>
                                                    <button onClick={() => handleDelete(student.id)} className="text-red-500 hover:text-red-600 transition-colors p-1.5 rounded-md" title="Delete Student" disabled={isDeleting}>
                                                        {isDeleting ? <Spinner /> : <FiTrash2 className="w-[18px] h-[18px] stroke-[1.5]" />}
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