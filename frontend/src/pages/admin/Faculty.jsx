import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useFaculty from '../../hooks/useFaculty';
import { FiPlus, FiTrash2, FiEye, FiEyeOff, FiSave, FiX, FiDownload, FiSearch, FiUsers, FiMail, FiPhone, FiMapPin, FiCalendar, FiBookOpen } from 'react-icons/fi';
import EditIcon from '../../components/ui/EditIcon';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Skeleton';

// Sample faculty data matching the exact specifications
const sampleFaculty = [
    {
        user: {
            id: 1,
            user_id: 'FAC-CS-001',
            firstname: 'Roberto',
            middlename: '',
            lastname: 'Fernandez',
            email: 'r.fernandez@ccs.edu',
            contact_number: '09171234580',
            address: 'CCS Building - Room 301',
            is_active: true,
        },
        faculty: {
            department: 'Computer Science',
            position: 'Professor',
            specialization: 'Artificial Intelligence, Machine Learning',
            subjects_handled: 'AI Fundamentals, Machine Learning, Deep Learning, Neural Networks',
            teaching_schedule: 'Mon 9:00-12:00 - AI Fundamentals, Wed 13:00-16:00 - Machine Learning, Fri 14:00-17:00 - Deep Learning',
            research_projects: 'Neural Network Optimization for Image Recognition, Predictive Analytics for Student Performance',
        },
    },
    {
        user: {
            id: 2,
            user_id: 'FAC-IT-002',
            firstname: 'Maria',
            middlename: '',
            lastname: 'Gonzales',
            email: 'm.gonzales@ccs.edu',
            contact_number: '09191234581',
            address: 'CCS Building - Room 205',
            is_active: true,
        },
        faculty: {
            department: 'Information Technology',
            position: 'Associate Professor',
            specialization: 'Network Security, Cyber Security',
            subjects_handled: 'Network Security, Ethical Hacking, Cryptography, Digital Forensics',
            teaching_schedule: 'Tue 10:00-13:00 - Network Security, Thu 10:00-13:00 - Ethical Hacking, Sat 9:00-12:00 - Cryptography',
            research_projects: 'Advanced Threat Detection Systems, Blockchain Security Applications',
        },
    },
    {
        user: {
            id: 3,
            user_id: 'FAC-CS-003',
            firstname: 'Antonio',
            middlename: '',
            lastname: 'Rivera',
            email: 'a.rivera@ccs.edu',
            contact_number: '09191234582',
            address: 'CCS Building - Room 108',
            is_active: true,
        },
        faculty: {
            department: 'Computer Science',
            position: 'Assistant Professor',
            specialization: 'Software Engineering, Web Development',
            subjects_handled: 'Software Engineering, Web Development, Agile Methodologies, Database Systems',
            teaching_schedule: 'Mon 13:00-16:00 - Software Engineering, Wed 9:00-12:00 - Web Development, Fri 10:00-13:00 - Agile Methodologies',
            research_projects: 'Microservices Architecture Best Practices, Full-Stack Development Frameworks Comparison',
        },
    },
];

const FacultyPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const {
        faculty,
        loading,
        error,
        formMode,
        formData,
        fieldErrors,
        touched,
        showForm,
        isCreating,
        isUpdating,
        deletingUserId,
        togglingUserId,
        showPassword,
        showConfirmPassword,
        setShowPassword,
        setShowConfirmPassword,
        handleInputChange,
        handleBlur,
        resetForm,
        handleCreate,
        handleEdit,
        handleUpdate,
        handleDelete,
        handleToggleStatus,
        openCreateForm,
    } = useFaculty();

    if (user?.role !== 'admin') {
        return <div className="p-6 text-red-500 dark:text-red-400">You do not have permission to view this page.</div>;
    }

    // Helper to render a field with error, help text, and onBlur
    const renderField = (label, name, type = 'text', required = false, options = null, helpText = null) => {
        const value = formData[name];
        const error = fieldErrors[name];
        const showError = touched[name] || error;

        return (
            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {type === 'select' ? (
                    <Select
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(name)}
                        error={showError ? error : undefined}
                    >
                        <option value="">Select {label}</option>
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Select>
                ) : type === 'textarea' ? (
                    <Textarea
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(name)}
                        rows="2"
                        error={showError ? error : undefined}
                    />
                ) : type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            name={name}
                            checked={value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                ) : (
                    <Input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(name)}
                        error={showError ? error : undefined}
                    />
                )}
                {helpText && !error && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
            </div>
        );
    };

    // Parse comma-separated strings
    const parseList = (str) => {
        if (!str) return [];
        return str.split(',').map(item => item.trim()).filter(Boolean);
    };

    // Use sample data if no faculty data is available
    const displayFaculty = faculty.length > 0 ? faculty : sampleFaculty;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6">
            {/* Page Layout & Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Faculty Management</h1>
                </div>
                <Button
                    variant="primary"
                    onClick={openCreateForm}
                    className="gap-2 bg-[#FF8C00] hover:bg-[#FF9C20] text-white font-semibold shadow-lg shadow-orange-500/20"
                >
                    <FiPlus className="w-4 h-4" /> Add Faculty
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
                    {error}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex justify-between items-center z-10 shrink-0">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {formMode === 'create' ? 'Add New Faculty' : 'Edit Faculty Record'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
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
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Password {formMode === 'create' && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                onBlur={() => handleBlur('password')}
                                                className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${fieldErrors.password && (touched.password || fieldErrors.password) ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-lg`}
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
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Confirm Password {formMode === 'create' && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={formData.password_confirmation}
                                                onChange={handleInputChange}
                                                onBlur={() => handleBlur('password_confirmation')}
                                                className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${fieldErrors.password_confirmation && (touched.password_confirmation || fieldErrors.password_confirmation) ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-lg`}
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
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">Faculty Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {renderField('Department', 'department', 'select', true, [
                                            { value: 'BSIT', label: 'BS Information Technology' },
                                            { value: 'BSCS', label: 'BS Computer Science' }
                                        ])}
                                        {renderField('Specialization', 'specialization')}
                                        {renderField('Subjects Handled (comma separated)', 'subjects_handled', 'text', false, null, 'Separate with commas')}
                                        {renderField('Teaching Schedule (comma separated)', 'teaching_schedule', 'text', false, null, 'Separate with commas')}
                                        {renderField('Research Projects (comma separated)', 'research_projects', 'text', false, null, 'Separate with commas')}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#181818] border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end gap-3 shrink-0">
                            <Button variant="secondary" type="button" onClick={resetForm} disabled={isCreating || isUpdating} className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" form="faculty-form" className="gap-2 bg-[#FF8C00] hover:bg-[#FF9C20] text-white" disabled={isCreating || isUpdating}>
                                {(isCreating || isUpdating) ? <Spinner /> : <FiSave />}
                                <span>{formMode === 'create' ? 'Create Faculty' : 'Save Changes'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <Card className="p-6 mb-6">
                <div className="relative w-full">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5 pointer-events-none" />
                    <Input type="text" placeholder="Search by name, faculty ID, or department..." className="pl-11 h-10" />
                </div>
            </Card>

            {/* Faculty Cards Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8C00]"></div>
                </div>
            ) : displayFaculty.length === 0 ? (
                <EmptyState
                    icon={<FiUsers />}
                    title="No Faculty Found"
                    description="No faculty found in the database."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {displayFaculty.map((member) => {
                        const fullName = [member.user.firstname, member.user.middlename, member.user.lastname].filter(Boolean).join(' ');
                        const initials = member.user.firstname?.[0] || 'F';
                        const subjects = parseList(member.faculty?.subjects_handled);
                        const schedule = parseList(member.faculty?.teaching_schedule);
                        const research = parseList(member.faculty?.research_projects);

                        return (
                            <Card key={member.user.id} className="bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col h-full">
                                <CardContent className="p-0 flex flex-col flex-1">
                                    {/* Card Header */}
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                                        <div className="flex items-start gap-4">
                                            {/* Profile Picture */}
                                            <div className="relative">
                                                <div className="w-16 h-16 square-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/20">
                                                    {initials}
                                                </div>
                                            </div>

                                            {/* Name and ID */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                                    {fullName}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {member.user.user_id}
                                                </p>
                                                <div className="mt-2">
                                                    <Badge variant="orange">
                                                        {member.faculty?.position || 'Professor'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Section */}
                                    <div className="p-6 space-y-4 flex-1">
                                        {/* Department & Specialization */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Department:</span>
                                                <span className="text-gray-900 dark:text-white font-medium">{member.faculty?.department || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Specialization:</span>
                                                <span className="text-gray-900 dark:text-white font-medium">{member.faculty?.specialization || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* Subjects Handled */}
                                        {subjects.length > 0 && (
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Subjects Handled:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {subjects.slice(0, 3).map((subject, idx) => (
                                                        <span key={idx} className="px-2.5 py-1 bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs rounded-full border border-orange-200 dark:border-orange-500/20">
                                                            {subject}
                                                        </span>
                                                    ))}
                                                    {subjects.length > 3 && (
                                                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-gray-700">
                                                            + {subjects.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Contact Info */}
                                        <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <FiMail className="w-4 h-4 text-gray-600 dark:text-white shrink-0" />
                                                    <span className="truncate">{member.user.email || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <FiPhone className="w-4 h-4 text-gray-600 dark:text-white shrink-0" />
                                                    <span>{member.user.contact_number || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <FiMapPin className="w-4 h-4 text-gray-600 dark:text-white shrink-0" />
                                                    <span className="truncate">{member.user.address || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Teaching Schedule */}
                                        {schedule.length > 0 && (
                                            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                                    <FiCalendar className="w-3.5 h-3.5" />
                                                    <span>Teaching Schedule</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {schedule.slice(0, 2).map((item, idx) => (
                                                        <p key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                                            {item}
                                                        </p>
                                                    ))}
                                                    {schedule.length > 2 && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                                            + {schedule.length - 2} more
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Research Projects */}
                                        {research.length > 0 && (
                                            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                                    <FiBookOpen className="w-3.5 h-3.5" />
                                                    <span>Research Projects</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {research.map((item, idx) => (
                                                        <p key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                                            - {item}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="px-6 pb-6 pt-2 mt-auto">
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="primary"
                                                className="flex-1 gap-2 bg-[#FF8C00] hover:bg-[#FF9C20] text-white font-semibold"
                                                onClick={() => navigate(`/faculty/${member.user.id}`)}
                                            >
                                                
                                                View Details
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(member)}
                                                className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/30"
                                                title="Edit Faculty"
                                                disabled={togglingUserId !== null || deletingUserId !== null}
                                            >
                                                <EditIcon className="w-4 h-4 text-black" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(member.user.id)}
                                                className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500/30"
                                                title="Delete Faculty"
                                                disabled={deletingUserId !== null || togglingUserId !== null}
                                            >
                                                {deletingUserId === member.user.id ? <Spinner /> : <FiTrash2 className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FacultyPage;
