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
    FiSearch,
    FiUsers,
    FiPower
} from 'react-icons/fi';

const Spinner = () => (
    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-[#F97316] border-t-transparent"></div>
);

const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
};

const FacultyPage = () => {
    const { user } = useAuth();
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [formMode, setFormMode] = useState('create');
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        user_id: '',
        email: '',
        password: '',
        password_confirmation: '',
        birth_date: '',
        contact_number: '',
        gender: '',
        address: '',
        is_active: true,
        department: '',
        specialization: '',
        subjects_handled: '',
        teaching_schedule: '',
        research_projects: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [togglingUserId, setTogglingUserId] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (user?.role !== 'admin') {
        return <div className="p-6 text-red-500 dark:text-red-400">You do not have permission to view this page.</div>;
    }

    // --- Validation helpers ---
    const validateField = (name, value, isCreate = true) => {
        switch (name) {
            case 'firstname':
                if (!value?.trim()) return 'First name is required.';
                if (value.length > 255) return 'Maximum 255 characters.';
                break;
            case 'lastname':
                if (!value?.trim()) return 'Last name is required.';
                if (value.length > 255) return 'Maximum 255 characters.';
                break;
            case 'user_id':
                if (!value?.trim()) return 'Faculty ID is required.';
                if (!/^\d{7}$/.test(value)) return 'Must be exactly 7 digits.';
                break;
            case 'email':
                if (!value?.trim()) return 'Email is required.';
                if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format.';
                break;
            case 'password':
                if (isCreate && !value) return 'Password is required.';
                if (value && (value.length < 8 || !/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value))) {
                    return 'Password must be at least 8 characters and contain uppercase, lowercase, and number.';
                }
                break;
            case 'password_confirmation':
                if (isCreate && !value) return 'Please confirm your password.';
                if (value && value !== formData.password) return 'Passwords do not match.';
                break;
            default:
                break;
        }
        return null;
    };

    const validateForm = () => {
        const errors = {};
        const isCreate = formMode === 'create';
        const fieldsToCheck = ['firstname', 'lastname', 'user_id', 'email'];
        if (isCreate) {
            fieldsToCheck.push('password', 'password_confirmation');
        } else {
            if (formData.password) {
                const pwdError = validateField('password', formData.password, false);
                if (pwdError) errors.password = pwdError;
                const confirmError = validateField('password_confirmation', formData.password_confirmation, false);
                if (confirmError) errors.password_confirmation = confirmError;
            }
        }
        fieldsToCheck.forEach(field => {
            const error = validateField(field, formData[field], isCreate);
            if (error) errors[field] = error;
        });
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, formData[name], formMode === 'create');
        if (error) {
            setFieldErrors(prev => ({ ...prev, [name]: error }));
        } else {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const getErrorMessage = (err) => {
        if (err.response?.data?.errors) return err.response.data.errors;
        return {};
    };

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getFaculty();
            setFaculty(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch faculty.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaculty();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: undefined }));
        }
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
            birth_date: '',
            contact_number: '',
            gender: '',
            address: '',
            is_active: true,
            department: '',
            specialization: '',
            subjects_handled: '',
            teaching_schedule: '',
            research_projects: '',
        });
        setFieldErrors({});
        setTouched({});
        setEditingId(null);
        setFormMode('create');
        setShowForm(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsCreating(true);
        try {
            const facultyData = {
                firstname: formData.firstname,
                middlename: formData.middlename,
                lastname: formData.lastname,
                user_id: formData.user_id,
                email: formData.email,
                password: formData.password,
                role: 'faculty',
                birth_date: formData.birth_date || null,
                contact_number: formData.contact_number,
                gender: formData.gender,
                address: formData.address,
                is_active: formData.is_active,
                department: formData.department,
                specialization: formData.specialization,
                subjects_handled: formData.subjects_handled ? formData.subjects_handled.split(',').map(s => s.trim()) : null,
                teaching_schedule: formData.teaching_schedule ? formData.teaching_schedule.split(',').map(s => s.trim()) : null,
                research_projects: formData.research_projects ? formData.research_projects.split(',').map(s => s.trim()) : null,
            };
            await userAPI.createUser(facultyData);
            await fetchFaculty();
            resetForm();
        } catch (err) {
            const serverErrors = getErrorMessage(err);
            if (Object.keys(serverErrors).length > 0) {
                setFieldErrors(serverErrors);
            } else {
                setError(err.response?.data?.message || 'Failed to create faculty.');
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleEdit = (member) => {
        const f = member.faculty;
        setFormData({
            firstname: member.user.firstname,
            middlename: member.user.middlename || '',
            lastname: member.user.lastname,
            user_id: member.user.user_id,
            email: member.user.email,
            password: '',
            password_confirmation: '',
            birth_date: formatDateForInput(member.user.birth_date),
            contact_number: member.user.contact_number || '',
            gender: member.user.gender || '',
            address: member.user.address || '',
            is_active: member.user.is_active,
            department: f?.department || '',
            specialization: f?.specialization || '',
            subjects_handled: Array.isArray(f?.subjects_handled) ? f.subjects_handled.join(', ') : '',
            teaching_schedule: Array.isArray(f?.teaching_schedule) ? f.teaching_schedule.join(', ') : '',
            research_projects: Array.isArray(f?.research_projects) ? f.research_projects.join(', ') : '',
        });
        setFieldErrors({});
        setTouched({});
        setEditingId(member.user.id);
        setFormMode('edit');
        setShowForm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsUpdating(true);
        try {
            const updateData = {
                firstname: formData.firstname,
                middlename: formData.middlename,
                lastname: formData.lastname,
                email: formData.email,
                birth_date: formData.birth_date || null,
                contact_number: formData.contact_number,
                gender: formData.gender,
                address: formData.address,
                is_active: formData.is_active,
                department: formData.department,
                specialization: formData.specialization,
                subjects_handled: formData.subjects_handled ? formData.subjects_handled.split(',').map(s => s.trim()) : null,
                teaching_schedule: formData.teaching_schedule ? formData.teaching_schedule.split(',').map(s => s.trim()) : null,
                research_projects: formData.research_projects ? formData.research_projects.split(',').map(s => s.trim()) : null,
            };
            if (formData.password) updateData.password = formData.password;
            await userAPI.updateUser(editingId, updateData);
            await fetchFaculty();
            resetForm();
        } catch (err) {
            const serverErrors = getErrorMessage(err);
            if (Object.keys(serverErrors).length > 0) {
                setFieldErrors(serverErrors);
            } else {
                setError(err.response?.data?.message || 'Failed to update faculty.');
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (userId) => {
        const selected = faculty.find(f => f.user.id === userId);
        const name = `${selected?.user.firstname} ${selected?.user.lastname}`;
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

        setDeletingUserId(userId);
        setError('');
        try {
            await userAPI.deleteUser(userId);
            await fetchFaculty();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete faculty.');
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleToggleStatus = async (member) => {
        const newStatus = !member.user.is_active;
        const action = newStatus ? 'activate' : 'deactivate';
        if (!window.confirm(`Are you sure you want to ${action} ${member.user.firstname} ${member.user.lastname}?`)) return;

        setTogglingUserId(member.user.id);
        setError('');
        try {
            await userAPI.updateUser(member.user.id, { is_active: newStatus });
            await fetchFaculty();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${action} faculty.`);
        } finally {
            setTogglingUserId(null);
        }
    };

    // Helper to render a field with error, help text, and onBlur
    const renderField = (label, name, type = 'text', required = false, options = null, helpText = null) => {
        const value = formData[name];
        const error = fieldErrors[name];
        const showError = touched[name] || error;

        return (
            <div className="mb-4">
                <label className="block text-[13px] font-bold text-gray-900 dark:text-gray-300 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {type === 'select' ? (
                    <select
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(name)}
                        className={`w-full h-11 px-4 bg-white dark:bg-[#121212] border ${error && showError ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                    >
                        <option value="">Select {label}</option>
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ) : type === 'textarea' ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(name)}
                        rows="2"
                        className={`w-full px-4 py-2 bg-white dark:bg-[#121212] border ${error && showError ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                    />
                ) : type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name={name}
                            checked={value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500"
                        />
                        <span className="text-[13px] text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(name)}
                        className={`w-full h-11 px-4 bg-white dark:bg-[#121212] border ${error && showError ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                    />
                )}
                {helpText && !error && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
                {error && showError && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Faculty Management</h1>
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
                        <FiPlus className="w-4 h-4" /> Add Faculty
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex justify-between items-center z-10 shrink-0">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                {formMode === 'create' ? 'Add New Faculty' : 'Edit Faculty Record'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto w-full p-6">
                            <form id="faculty-form" onSubmit={formMode === 'create' ? handleCreate : handleUpdate} className="space-y-5">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {renderField('First Name', 'firstname', 'text', true, null, 'Maximum 255 characters')}
                                    {renderField('Middle Name', 'middlename', 'text', false, null, 'Maximum 255 characters')}
                                    {renderField('Last Name', 'lastname', 'text', true, null, 'Maximum 255 characters')}
                                    {renderField('Faculty ID', 'user_id', 'text', true, null, 'Exactly 7 digits (e.g., 2024001)')}
                                    {renderField('Email', 'email', 'email', true, null, 'Valid email address')}
                                </div>

                                {/* Personal Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-200 dark:border-gray-800">
                                    {renderField('Birth Date', 'birth_date', 'date')}
                                    {renderField('Contact Number', 'contact_number')}
                                    {renderField('Gender', 'gender', 'select', false, [
                                        { value: 'male', label: 'Male' },
                                        { value: 'female', label: 'Female' },
                                        { value: 'other', label: 'Other' }
                                    ])}
                                    {renderField('Address', 'address', 'textarea')}
                                    {renderField('Active', 'is_active', 'checkbox')}
                                </div>

                                {/* Password */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-200 dark:border-gray-800">
                                    <div>
                                        <label className="block text-[13px] font-bold text-gray-900 dark:text-gray-300 mb-1.5">
                                            Password {formMode === 'create' && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                onBlur={() => handleBlur('password')}
                                                className={`w-full h-11 pl-4 pr-11 bg-white dark:bg-[#121212] border ${fieldErrors.password && (touched.password || fieldErrors.password) ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} shadow-sm rounded-lg`}
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                        {!fieldErrors.password && (
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                At least 8 characters, including uppercase, lowercase, and number.
                                            </p>
                                        )}
                                        {fieldErrors.password && (touched.password || fieldErrors.password) && (
                                            <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-gray-900 dark:text-gray-300 mb-1.5">
                                            Confirm Password {formMode === 'create' && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={formData.password_confirmation}
                                                onChange={handleInputChange}
                                                onBlur={() => handleBlur('password_confirmation')}
                                                className={`w-full h-11 pl-4 pr-11 bg-white dark:bg-[#121212] border ${fieldErrors.password_confirmation && (touched.password_confirmation || fieldErrors.password_confirmation) ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} shadow-sm rounded-lg`}
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
                                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                        {fieldErrors.password_confirmation && (touched.password_confirmation || fieldErrors.password_confirmation) && (
                                            <p className="mt-1 text-xs text-red-500">{fieldErrors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Faculty Details */}
                                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">Faculty Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {renderField('Department', 'department')}
                                        {renderField('Specialization', 'specialization')}
                                        {renderField('Subjects Handled (comma separated)', 'subjects_handled', 'text', false, null, 'Separate with commas')}
                                        {renderField('Teaching Schedule (comma separated)', 'teaching_schedule', 'text', false, null, 'Separate with commas')}
                                        {renderField('Research Projects (comma separated)', 'research_projects', 'text', false, null, 'Separate with commas')}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#181818] border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={resetForm} className="px-5 py-2.5 bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-lg text-[14px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors flex items-center shadow-sm" disabled={isCreating || isUpdating}>Cancel</button>
                            <button type="submit" form="faculty-form" className="px-5 py-2.5 bg-[#F97316] text-white rounded-lg text-[14px] font-medium hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-60" disabled={isCreating || isUpdating}>
                                {(isCreating || isUpdating) ? <Spinner /> : <FiSave />}
                                <span>{formMode === 'create' ? 'Create Faculty' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
                <div className="relative w-full">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5 pointer-events-none" />
                    <input type="text" placeholder="Search by name, faculty ID, or department..." className="w-full h-10 pl-11 pr-4 bg-[#F3F3F5] dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
            </div>

            {/* Faculty Table */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                {loading ? (
                    <div className="flex justify-center items-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F97316]"></div></div>
                ) : faculty.length === 0 ? (
                    <div className="text-center py-16 text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center"><FiUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" /><p>No faculty found in the database.</p></div>
                ) : (
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200">Photo</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200">Faculty ID</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200">Name</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200">Department</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200">Specialization</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200">Status</th>
                                    <th className="pb-4 text-[14px] font-bold text-gray-800 dark:text-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {faculty.map((member) => {
                                    const fullName = [member.user.firstname, member.user.middlename, member.user.lastname].filter(Boolean).join(' ');
                                    const initials = member.user.firstname?.[0] || 'F';
                                    const isActive = member.user.is_active;
                                    return (
                                        <tr key={member.user.id} className="hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors h-[60px]">
                                            <td className="py-2 pr-4 whitespace-nowrap"><div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-[12px] font-bold">{initials}</div></td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] font-medium">{member.user.user_id}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px]">{fullName}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px]">{member.faculty?.department || 'N/A'}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px]">{member.faculty?.specialization || 'N/A'}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-[9px] text-[12px] font-medium ${isActive ? 'bg-[#00C950] text-[#fff]' : 'bg-gray-300 text-gray-700'}`}>
                                                    {isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-2 pr-4 whitespace-nowrap">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleToggleStatus(member)}
                                                        className={`p-1.5 rounded-md transition-colors ${isActive ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20' : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'}`}
                                                        title={isActive ? 'Deactivate' : 'Activate'}
                                                        disabled={togglingUserId !== null}
                                                    >
                                                        {togglingUserId === member.user.id ? <Spinner /> : <FiPower className="w-[18px] h-[18px]" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(member)}
                                                        className="text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-500/10 transition-colors p-1.5 rounded-md"
                                                        title="Edit Faculty"
                                                        disabled={togglingUserId !== null || deletingUserId !== null}
                                                    >
                                                        <FiEdit2 className="w-[18px] h-[18px]" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(member.user.id)}
                                                        className={`p-1.5 rounded-md transition-colors ${isActive ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20'}`}
                                                        title={isActive ? 'Must deactivate before deletion' : 'Delete Faculty'}
                                                        disabled={isActive || deletingUserId !== null || togglingUserId !== null}
                                                    >
                                                        {deletingUserId === member.user.id ? <Spinner /> : <FiTrash2 className="w-[18px] h-[18px]" />}
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

export default FacultyPage;