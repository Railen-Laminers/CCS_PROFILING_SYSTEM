import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { userAPI } from '../../services/api';

import { Spinner } from '@/components/ui/Skeleton';

const DEFAULT_FORM_DATA = {
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
    parent_guardian_name: '',
    emergency_contact: '',
    section: '',
    program: '',
    year_level: '',
    gpa: '',
    blood_type: '',
    disabilities: '',
    medical_condition: '',
    allergies: '',
    sports_activities: '',
    organizations: '',
    behavior_discipline_records: '',
    current_subjects: '',
    academic_awards: '',
    events_participated: '',
};

const StudentFormModal = ({ isOpen, onClose, mode = 'create', initialData = null, userId = null, onSuccess }) => {
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                const formattedData = { ...initialData };
                const arrayFields = ['sports_activities', 'organizations', 'behavior_discipline_records', 'current_subjects', 'academic_awards', 'events_participated'];
                arrayFields.forEach(field => {
                    const value = formattedData[field];
                    if (Array.isArray(value)) {
                        formattedData[field] = value.join(', ');
                    } else if (value && typeof value === 'object') {
                        // Handle nested objects for sports and organizations
                        const innerArray = value.sportsPlayed || value.clubs;
                        if (Array.isArray(innerArray)) {
                            formattedData[field] = innerArray.join(', ');
                        }
                    }
                });
                setFormData(formattedData);
            } else {
                setFormData(DEFAULT_FORM_DATA);
            }
            setFieldErrors({});
            setTouched({});
            setError('');
            setShowPassword(false);
            setShowConfirmPassword(false);
            setIsSaving(false);
        }
    }, [isOpen, initialData, mode]);

    if (!isOpen) return null;

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
                if (!value?.trim()) return 'Student ID is required.';
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
            case 'year_level':
                if (value && (value < 1 || value > 4)) return 'Year level must be between 1 and 4.';
                break;
            case 'gpa':
                if (value && (value < 0 || value > 4)) return 'GPA must be between 0 and 4.';
                break;
            default:
                break;
        }
        return null;
    };

    const validateForm = () => {
        const errors = {};
        const isCreate = mode === 'create';
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
        const yearError = validateField('year_level', formData.year_level);
        if (yearError) errors.year_level = yearError;
        const gpaError = validateField('gpa', formData.gpa);
        if (gpaError) errors.gpa = gpaError;

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, formData[name], mode === 'create');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSaving(true);
        setError('');
        try {
            const dataToSubmit = {
                firstname: formData.firstname,
                middlename: formData.middlename,
                lastname: formData.lastname,
                email: formData.email,
                birth_date: formData.birth_date || null,
                contact_number: formData.contact_number,
                gender: formData.gender,
                address: formData.address,
                is_active: formData.is_active,
                parent_guardian_name: formData.parent_guardian_name,
                emergency_contact: formData.emergency_contact,
                section: formData.section,
                program: formData.program,
                year_level: formData.year_level ? parseInt(formData.year_level) : null,
                gpa: formData.gpa ? parseFloat(formData.gpa) : null,
                blood_type: formData.blood_type,
                disabilities: formData.disabilities,
                medical_condition: formData.medical_condition,
                allergies: formData.allergies,
                sports_activities: formData.sports_activities ? { sportsPlayed: (typeof formData.sports_activities === 'string' ? formData.sports_activities.split(',').map(s => s.trim()).filter(Boolean) : formData.sports_activities) } : null,
                organizations: formData.organizations ? { clubs: (typeof formData.organizations === 'string' ? formData.organizations.split(',').map(s => s.trim()).filter(Boolean) : formData.organizations) } : null,
                behavior_discipline_records: formData.behavior_discipline_records ? (typeof formData.behavior_discipline_records === 'string' ? formData.behavior_discipline_records.split(',').map(s => s.trim()).filter(Boolean) : formData.behavior_discipline_records) : [],
                current_subjects: formData.current_subjects ? (typeof formData.current_subjects === 'string' ? formData.current_subjects.split(',').map(s => s.trim()).filter(Boolean) : formData.current_subjects) : [],
                academic_awards: formData.academic_awards ? (typeof formData.academic_awards === 'string' ? formData.academic_awards.split(',').map(s => s.trim()).filter(Boolean) : formData.academic_awards) : [],
                events_participated: formData.events_participated ? (typeof formData.events_participated === 'string' ? formData.events_participated.split(',').map(s => s.trim()).filter(Boolean) : formData.events_participated) : [],
            };

            if (mode === 'create') {
                dataToSubmit.user_id = formData.user_id;
                dataToSubmit.password = formData.password;
                dataToSubmit.role = 'student';
                await userAPI.createUser(dataToSubmit);
            } else {
                if (formData.password) dataToSubmit.password = formData.password;
                dataToSubmit.user_id = formData.user_id; // Add user_id just in case, though backend might ignore
                await userAPI.updateUser(userId, dataToSubmit);
            }
            
            if (onSuccess) await onSuccess();
            onClose();
        } catch (err) {
            const serverErrors = getErrorMessage(err);
            if (Object.keys(serverErrors).length > 0) {
                setFieldErrors(serverErrors);
            } else {
                setError(err.response?.data?.message || `Failed to ${mode === 'create' ? 'create' : 'update'} student.`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const renderField = (label, name, type = 'text', required = false, options = null, helpText = null, placeholder = null) => {
        const value = formData[name];
        const error = fieldErrors[name];
        const showError = touched[name] || error;
        const isSuccess = touched[name] && !error && value && value.toString().trim() !== '';

        const baseInputClass = `w-full h-11 px-4 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${
            error && showError 
                ? 'border-red-500 ring-red-500/10' 
                : isSuccess 
                    ? 'border-green-500/40 dark:border-green-500/30 bg-green-500/[0.02]' 
                    : 'border-gray-300 dark:border-gray-600'
        } shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-[#1E1E1E] transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500`;

        const textareaClass = `w-full px-4 py-2.5 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${
            error && showError 
                ? 'border-red-500 ring-red-500/10' 
                : isSuccess 
                    ? 'border-green-500/40 dark:border-green-500/30 bg-green-500/[0.02]' 
                    : 'border-gray-300 dark:border-gray-600'
        } shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-[#1E1E1E] transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 !resize-none min-h-[100px]`;

        const finalPlaceholder = placeholder || (required ? `Enter ${label.toLowerCase()}...` : `Enter ${label.toLowerCase()} (Optional)`);

        return (
            <div className="mb-4 text-left">
                <label className="block text-[13px] font-bold text-gray-900 dark:text-gray-300 mb-1.5 focus:outline-none">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {type === 'select' ? (
                    <select
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(name)}
                        className={baseInputClass}
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
                        placeholder={placeholder || ''}
                        className={textareaClass}
                    />
                ) : type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name={name}
                            checked={value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 rounded accent-orange-500"
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
                        placeholder={finalPlaceholder}
                        className={baseInputClass}
                    />
                )}
                {helpText && !error && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
                {error && showError && <p className="mt-1 text-xs text-red-500 text-left">{error}</p>}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden text-left">
                <div className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex justify-between items-center z-10 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        {mode === 'create' ? 'Add New Student' : 'Edit Student Record'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
                
                {error && (
                    <div className="mx-6 mt-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="overflow-y-auto w-full p-6 text-left">
                    <form id="student-update-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold ring-1 ring-brand-500/20">01</span>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest">Account & Identity</h3>
                                <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent ml-2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-11">
                            {renderField('First Name', 'firstname', 'text', true, null, 'Maximum 255 characters', 'Enter first name')}
                            {renderField('Middle Name', 'middlename', 'text', false, null, 'Maximum 255 characters', 'Enter middle name')}
                            {renderField('Last Name', 'lastname', 'text', true, null, 'Maximum 255 characters', 'Enter last name')}
                            {renderField('Student ID', 'user_id', 'text', true, null, 'Exactly 7 digits (e.g., 2024001)', 'e.g., 2024001')}
                            {renderField('Email', 'email', 'email', true, null, 'Valid email address', 'student@example.com')}
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold ring-1 ring-brand-500/20">02</span>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest">Personal Biography</h3>
                                <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent ml-2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-11">
                            {renderField('Birth Date', 'birth_date', 'date')}
                            {renderField('Contact Number', 'contact_number', 'tel', false, null, '11-digit mobile number', '09XXXXXXXXX')}
                            {renderField('Gender', 'gender', 'select', false, [
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' }
                            ])}
                            {renderField('Address', 'address', 'textarea', false, null, null, 'Full address')}
                            {renderField('Active', 'is_active', 'checkbox')}
                            </div>
                        </div>

                        {/* Security */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold ring-1 ring-brand-500/20">03</span>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest">Security Credentials</h3>
                                <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent ml-2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-11">
                            <div className="text-left">
                                <label className="block text-[13px] font-bold text-gray-900 dark:text-gray-300 mb-1.5 focus:outline-none">
                                    Password {mode === 'create' && <span className="text-red-500">*</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('password')}
                                        placeholder="Minimum 8 characters"
                                        className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${fieldErrors.password && (touched.password || fieldErrors.password) ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 rounded-lg transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 focus:outline-none">
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {!fieldErrors.password && (
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-left">
                                        At least 8 characters, including uppercase, lowercase, and number.
                                    </p>
                                )}
                                {fieldErrors.password && (touched.password || fieldErrors.password) && (
                                    <p className="mt-1 text-xs text-red-500 text-left">{fieldErrors.password}</p>
                                )}
                            </div>
                            <div className="text-left">
                                <label className="block text-[13px] font-bold text-gray-900 dark:text-gray-300 mb-1.5 focus:outline-none">
                                    Confirm Password {mode === 'create' && <span className="text-red-500">*</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('password_confirmation')}
                                        placeholder="Re-enter password"
                                        className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${fieldErrors.password_confirmation && (touched.password_confirmation || fieldErrors.password_confirmation) ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 rounded-lg transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 focus:outline-none">
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {fieldErrors.password_confirmation && (touched.password_confirmation || fieldErrors.password_confirmation) && (
                                    <p className="mt-1 text-xs text-red-500 text-left">{fieldErrors.password_confirmation}</p>
                                )}
                            </div>
                            </div>
                        </div>

                        {/* Academic Summary */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold ring-1 ring-brand-500/20">04</span>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest">Academic & Records</h3>
                                <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent ml-2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-11">
                                {renderField('Parent/Guardian Name', 'parent_guardian_name', 'text', false, null, null, 'Full name of guardian')}
                                {renderField('Emergency Contact', 'emergency_contact', 'tel', false, null, null, '09XXXXXXXXX')}
                                {renderField('Program', 'program', 'select', false, [
                                    { value: 'BSIT', label: 'BS Information Technology' },
                                    { value: 'BSCS', label: 'BS Computer Science' }
                                ])}
                                {renderField('Section', 'section', 'text', false, null, null, 'e.g., IT-A')}
                                {renderField('Year Level', 'year_level', 'select', false, [
                                    { value: '1', label: '1st Year' },
                                    { value: '2', label: '2nd Year' },
                                    { value: '3', label: '3rd Year' },
                                    { value: '4', label: '4th Year' }
                                ])}
                                {renderField('GPA', 'gpa', 'number', false, null, 'Between 0 and 4')}
                                {renderField('Blood Type', 'blood_type', 'select', false, [
                                    { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
                                    { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
                                    { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
                                    { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' }
                                ])}
                                {renderField('Disabilities', 'disabilities', 'textarea', false, null, null, 'Describe any disabilities')}
                                {renderField('Medical Condition', 'medical_condition', 'textarea', false, null, null, 'Describe any conditions')}
                                {renderField('Allergies', 'allergies', 'textarea', false, null, null, 'List known allergies')}
                                {renderField('Sports & Activities', 'sports_activities', 'textarea', false, null, null, 'List sports and activities')}
                                {renderField('Organizations', 'organizations', 'textarea', false, null, null, 'List organizations')}
                                {renderField('Behavior/Discipline Records', 'behavior_discipline_records', 'textarea')}
                                {renderField('Current Subjects', 'current_subjects', 'text', false, null, 'Separate with commas', 'e.g., Math, Science, English')}
                                {renderField('Academic Awards', 'academic_awards', 'text', false, null, 'Separate with commas', "e.g., Dean's Lister, Honor Roll")}
                                {renderField('Events Participated', 'events_participated', 'text', false, null, 'Separate with commas', 'e.g., Quiz Bee, Hackathon')}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="bg-gray-50 dark:bg-[#181818] border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-lg text-[14px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors flex items-center shadow-sm" disabled={isSaving}>Cancel</button>
                    <button type="submit" form="student-update-form" className="px-5 py-2.5 bg-[#F97316] text-white rounded-lg text-[14px] font-medium hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-60" disabled={isSaving}>
                        {isSaving ? <Spinner className="border-white" /> : <FiSave />}
                        <span>{mode === 'create' ? 'Create Student' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentFormModal;
