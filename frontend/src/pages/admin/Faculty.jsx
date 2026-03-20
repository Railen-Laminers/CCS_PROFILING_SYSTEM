import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaEyeSlash,
    FaSave,
    FaTimes
} from 'react-icons/fa';

const Spinner = () => (
    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
);

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
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (user?.role !== 'admin') {
        return <div className="p-6 text-red-500">You do not have permission to view this page.</div>;
    }

    const getErrorMessage = (err) => {
        if (err.response?.data?.errors) {
            const firstError = Object.values(err.response.data.errors)[0]?.[0];
            return firstError;
        }
        if (err.response?.data?.message) return err.response.data.message;
        return null;
    };

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getFaculty();
            setFaculty(data);
            setError('');
        } catch (err) {
            setError(getErrorMessage(err) || 'Failed to fetch faculty.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaculty();
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
            const newFaculty = await userAPI.createUser({
                firstname: formData.firstname,
                middlename: formData.middlename,
                lastname: formData.lastname,
                user_id: formData.user_id,
                email: formData.email,
                password: formData.password,
                role: 'faculty',
            });
            setFaculty((prev) => [...prev, newFaculty]);
            resetForm();
        } catch (err) {
            setError(getErrorMessage(err) || 'Failed to create faculty.');
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleEdit = (member) => {
        setFormData({
            firstname: member.firstname,
            middlename: member.middlename || '',
            lastname: member.lastname,
            user_id: member.user_id,
            email: member.email,
            password: '',
            password_confirmation: '',
        });
        setEditingId(member.id);
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
            const updatedMember = await userAPI.updateUser(editingId, updateData);
            setFaculty((prev) =>
                prev.map((m) => (m.id === editingId ? updatedMember : m))
            );
            resetForm();
        } catch (err) {
            setError(getErrorMessage(err) || 'Failed to update faculty.');
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
        setIsDeleting(true);
        setError('');
        try {
            await userAPI.deleteUser(id);
            setFaculty((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            setError(getErrorMessage(err) || 'Failed to delete faculty.');
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Faculty</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="bg-brand-500 text-white px-4 py-2 rounded-md hover:bg-brand-600 flex items-center gap-2"
                >
                    <FaPlus className="text-sm" /> Add Faculty
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                {formMode === 'create' ? 'Add Faculty' : 'Edit Faculty'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={formMode === 'create' ? handleCreate : handleUpdate} className="p-4">
                            {/* Same input fields as Student */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                                <input type="text" name="firstname" value={formData.firstname} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                                <input type="text" name="middlename" value={formData.middlename} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                                <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">User ID (7 digits) *</label>
                                <input type="text" name="user_id" value={formData.user_id} onChange={handleInputChange} required pattern="\d{7}" title="Must be exactly 7 digits" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password {formMode === 'create' ? '*' : '(leave blank to keep current)'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required={formMode === 'create'}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {formMode === 'create' && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Must be at least 8 characters, contain uppercase, lowercase, and number.
                                    </p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Confirm Password {formMode === 'create' ? '*' : '(if changing)'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        required={formMode === 'create'}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10"
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2" disabled={isCreating || isUpdating}>
                                    <FaTimes /> Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 flex items-center gap-2 disabled:opacity-50" disabled={isCreating || isUpdating}>
                                    {(isCreating || isUpdating) && <Spinner />}
                                    <FaSave />
                                    {formMode === 'create' ? (isCreating ? 'Creating...' : 'Create') : (isUpdating ? 'Updating...' : 'Update')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
                </div>
            ) : faculty.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No faculty found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {faculty.map((member) => (
                                <tr key={member.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {[member.firstname, member.middlename, member.lastname].filter(Boolean).join(' ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{member.user_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-800 p-1" disabled={isDeleting} title="Edit">
                                                <FaEdit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-800 p-1" disabled={isDeleting} title="Delete">
                                                {isDeleting && <Spinner />}
                                                {!isDeleting && <FaTrash size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FacultyPage;