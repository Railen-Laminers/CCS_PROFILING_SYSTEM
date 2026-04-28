import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiEye, FiEyeOff, FiPlus } from 'react-icons/fi';
import { userAPI } from '../../services/api';
import { Spinner } from '@/components/ui/Skeleton.jsx';

const PREDEFINED_ACTIVITIES = [
    'Basketball', 'Volleyball', 'Programming', 'Quiz Bee', 'Chess', 'Football/Soccer',
    'Swimming', 'Track and Field', 'Badminton', 'Table Tennis', 'Dance', 'Music/Band',
    'Art/Painting', 'Drama/Theater', 'Debate', 'Robotics', 'Science Club', 'Math Club',
    'Writing/Journalism', 'Photography', 'Coding Club', 'Student Council', 'Environmental Club',
    'Taekwondo/Martial Arts', 'Baseball', 'Tennis', 'Cheerleading', 'Choir/Singing',
    'Gaming/Esports', 'Cooking/Culinary', 'Gardening', 'Archery', 'Cycling', 'Skateboarding', 'Yoga/Fitness'
];

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
    sportsPlayed: '',
    athleticAchievements: '',
    competitions: '',
    clubs: '',
    studentCouncil: '',
    leadershipRoles: '',
    behavior_discipline_records: '',
    academic_awards: '',
    quiz_bee_participations: '',
    programming_contests: '',
    warnings: 0,
    suspensions: 0,
    counseling: 0,
    incidents: '',
    counseling_records: '',
};

const StudentFormModal = ({ isOpen, onClose, mode = 'create', initialData = null, userId = null, onSuccess }) => {
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [allergyInput, setAllergyInput] = useState('');
    const [disabilityInput, setDisabilityInput] = useState('');

    // Helper to convert arrays to comma-separated strings (for form fields)
    const stringifyArray = (val) => {
        if (Array.isArray(val)) return val.join(', ');
        if (typeof val === 'string') return val;
        return '';
    };

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                // Normalise initialData to ensure all fields are strings (never undefined)
                const formattedData = { ...initialData };

                // Convert array fields to comma strings
                formattedData.academic_awards = stringifyArray(formattedData.academic_awards);
                formattedData.quiz_bee_participations = stringifyArray(formattedData.quiz_bee_participations);
                formattedData.programming_contests = stringifyArray(formattedData.programming_contests);
                formattedData.disabilities = stringifyArray(formattedData.disabilities);
                formattedData.allergies = stringifyArray(formattedData.allergies);

                // Handle sports_activities object
                if (formattedData.sports_activities) {
                    formattedData.sportsPlayed = stringifyArray(formattedData.sports_activities.sportsPlayed);
                    formattedData.athleticAchievements = stringifyArray(formattedData.sports_activities.achievements);
                    formattedData.competitions = stringifyArray(formattedData.sports_activities.competitions);
                } else {
                    formattedData.sportsPlayed = '';
                    formattedData.athleticAchievements = '';
                    formattedData.competitions = '';
                }

                // Handle organizations object
                if (formattedData.organizations) {
                    formattedData.clubs = stringifyArray(formattedData.organizations.clubs);
                    formattedData.studentCouncil = stringifyArray(formattedData.organizations.studentCouncil);
                    formattedData.leadershipRoles = stringifyArray(formattedData.organizations.roles);
                } else {
                    formattedData.clubs = '';
                    formattedData.studentCouncil = '';
                    formattedData.leadershipRoles = '';
                }

                // Ensure all fields are present (fallback to empty string if missing)
                const safeData = { ...DEFAULT_FORM_DATA, ...formattedData };
                // Convert numeric fields that might be null/undefined to empty string
                safeData.year_level = safeData.year_level ?? '';
                safeData.gpa = safeData.gpa ?? '';
                safeData.warnings = safeData.warnings ?? 0;
                safeData.suspensions = safeData.suspensions ?? 0;
                safeData.counseling = safeData.counseling ?? 0;

                setFormData(safeData);
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
            case 'contact_number':
                if (value && !/^(\+?63|0)[9]\d{9}$/.test(value.replace(/\s/g, ''))) {
                    return 'Invalid Philippine mobile number (e.g., 09123456789 or +639123456789).';
                }
                break;
            case 'year_level':
                if (value && (value < 1 || value > 4)) return 'Year level must be between 1 and 4.';
                break;
            case 'gpa':
                if (value && (value < 0 || value > 5)) return 'GPA must be between 0 and 5.';
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

    const addItem = (field, value, setInput) => {
        if (!value.trim()) return;
        setFormData(prev => {
            const current = (prev[field] || '').split(',').map(s => s.trim()).filter(Boolean);
            if (current.includes(value.trim())) return prev;
            return {
                ...prev,
                [field]: [...current, value.trim()].join(', ')
            };
        });
        setInput('');
    };

    const removeItem = (field, index) => {
        setFormData(prev => {
            const current = (prev[field] || '').split(',').map(s => s.trim()).filter(Boolean);
            const updated = current.filter((_, i) => i !== index);
            return {
                ...prev,
                [field]: updated.join(', ')
            };
        });
    };

    const toggleActivity = (activity) => {
        setFormData(prev => {
            const current = typeof prev.sportsPlayed === 'string'
                ? prev.sportsPlayed.split(',').map(s => s.trim()).filter(Boolean)
                : [];

            let updated;
            if (current.includes(activity)) {
                updated = current.filter(i => i !== activity);
            } else {
                updated = [...current, activity];
            }

            return {
                ...prev,
                sportsPlayed: updated.join(', ')
            };
        });
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
            // Build the data to submit - matches backend expectations
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
                disabilities: typeof formData.disabilities === 'string' ? formData.disabilities.split(',').map(s => s.trim()).filter(Boolean) : [],
                medical_condition: formData.medical_condition,
                allergies: typeof formData.allergies === 'string' ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
                sports_activities: {
                    sportsPlayed: typeof formData.sportsPlayed === 'string' ? formData.sportsPlayed.split(',').map(s => s.trim()).filter(Boolean) : [],
                    achievements: typeof formData.athleticAchievements === 'string' ? formData.athleticAchievements.split(',').map(s => s.trim()).filter(Boolean) : [],
                    competitions: typeof formData.competitions === 'string' ? formData.competitions.split(',').map(s => s.trim()).filter(Boolean) : []
                },
                organizations: {
                    clubs: typeof formData.clubs === 'string' ? formData.clubs.split(',').map(s => s.trim()).filter(Boolean) : [],
                    studentCouncil: typeof formData.studentCouncil === 'string' ? formData.studentCouncil.split(',').map(s => s.trim()).filter(Boolean) : [],
                    roles: typeof formData.leadershipRoles === 'string' ? formData.leadershipRoles.split(',').map(s => s.trim()).filter(Boolean) : []
                },
                academic_awards: typeof formData.academic_awards === 'string' ? formData.academic_awards.split(',').map(s => s.trim()).filter(Boolean) : [],
                quiz_bee_participations: typeof formData.quiz_bee_participations === 'string' ? formData.quiz_bee_participations.split(',').map(s => s.trim()).filter(Boolean) : [],
                programming_contests: typeof formData.programming_contests === 'string' ? formData.programming_contests.split(',').map(s => s.trim()).filter(Boolean) : [],
                behavior_discipline_records: {
                    warnings: parseInt(formData.warnings) || 0,
                    suspensions: parseInt(formData.suspensions) || 0,
                    counseling: parseInt(formData.counseling) || 0,
                    incidents: formData.incidents || '',
                    counselingRecords: formData.counseling_records || ''
                }
            };

            if (mode === 'create') {
                dataToSubmit.user_id = formData.user_id;
                dataToSubmit.password = formData.password;
                dataToSubmit.role = 'student';
                await userAPI.createUser(dataToSubmit);
            } else {
                // For update, only include fields that are present (backend handles partial)
                if (formData.password) dataToSubmit.password = formData.password;
                // user_id is not updated in edit mode (backend may ignore)
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

    const renderField = (label, name, type = 'text', required = false, options = null, helpText = null, placeholder = null, min = null, max = null, step = null) => {
        const value = formData[name];
        const error = fieldErrors[name];
        const showError = touched[name] || error;
        const isSuccess = touched[name] && !error && value && value.toString().trim() !== '';

        const baseInputClass = `w-full h-11 px-4 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${error && showError
                ? 'border-red-500 ring-red-500/10'
                : isSuccess
                    ? 'border-green-500/40 dark:border-green-500/30 bg-green-500/[0.02]'
                    : 'border-gray-300 dark:border-gray-600'
            } shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-[#1E1E1E] transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500`;

        const textareaClass = `w-full px-4 py-2.5 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${error && showError
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
                        min={min}
                        max={max}
                        step={step}
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
                        {/* 1. Student Information */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold ring-1 ring-brand-500/20">01</span>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest">Student Information</h3>
                                <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent ml-2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-11">
                                {renderField('Student ID', 'user_id', 'text', true, null, 'Exactly 7 digits (e.g., 2024001)', 'e.g., 2024001')}
                                {renderField('First name', 'firstname', 'text', true, null, 'Maximum 255 characters', 'Enter first name')}
                                {renderField('Middle name', 'middlename', 'text', false, null, 'Maximum 255 characters', 'Enter middle name (optional)')}
                                {renderField('Last name', 'lastname', 'text', true, null, 'Maximum 255 characters', 'Enter last name')}

                                <div className="md:col-span-2">
                                    {renderField('Email address', 'email', 'email', true, null, 'Valid email address', 'your@email.com')}
                                </div>

                                {renderField('Contact number', 'contact_number', 'tel', false, null, '09XXXXXXXXX', '09XXXXXXXXX')}
                                {renderField('Gender', 'gender', 'select', false, [
                                    { value: '', label: 'Prefer not to say' },
                                    { value: 'male', label: 'Male' },
                                    { value: 'female', label: 'Female' },
                                    { value: 'other', label: 'Other' }
                                ])}

                                {renderField('Birth date', 'birth_date', 'date')}
                                <div className="md:col-span-1"></div>

                                <div className="md:col-span-2">
                                    {renderField('Complete address', 'address', 'textarea', false, null, null, 'Street, Barangay, City, Province, Zip Code')}
                                </div>
                                {renderField('Parent/Guardian name', 'parent_guardian_name', 'text', false, null, null, 'Full name of parent or guardian')}
                                {renderField('Emergency contact number', 'emergency_contact', 'tel', false, null, null, '+63 XXX XXX XXXX')}
                            </div>
                        </div>

                        {/* 2. Security Credentials */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold ring-1 ring-brand-500/20">02</span>
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

                        {/* 3. Academic Record */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold ring-1 ring-brand-500/20">03</span>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest">Academic Record</h3>
                                <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent ml-2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-11">
                                {renderField('Course/Program', 'program', 'select', false, [
                                    { value: 'BSIT', label: 'BS Information Technology' },
                                    { value: 'BSCS', label: 'BS Computer Science' },
                                    { value: 'BSIS', label: 'BS Information Systems' }
                                ])}
                                {renderField('Year Level', 'year_level', 'select', false, [
                                    { value: '1', label: '1st Year' },
                                    { value: '2', label: '2nd Year' },
                                    { value: '3', label: '3rd Year' },
                                    { value: '4', label: '4th Year' }
                                ])}
                                {renderField('Section', 'section', 'text', false, null, null, 'e.g., IT-A')}
                                {renderField('GPA', 'gpa', 'number', false, null, 'Range: 0.00 to 5.00', 'e.g., 1.25', 0, 5, 0.01)}
                                <div className="md:col-span-2">
                                    {renderField('Academic Awards', 'academic_awards', 'text', false, null, 'Separate with commas', "e.g., Dean's Lister, Honor Roll")}
                                </div>
                                <div className="md:col-span-2">
                                    {renderField('Quiz Bee Participations', 'quiz_bee_participations', 'text', false, null, 'Separate with commas', "e.g., Regionals 2023, Math Quiz Bee")}
                                </div>
                                <div className="md:col-span-2">
                                    {renderField('Programming Contests', 'programming_contests', 'text', false, null, 'Separate with commas', "e.g., Hackathon 2024, Coding Cup")}
                                </div>
                            </div>
                        </div>

                        {/* 4. Medical Record */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold ring-1 ring-brand-500/20">04</span>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest">Medical Record</h3>
                                <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent ml-2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-11">
                                {renderField('Blood Type', 'blood_type', 'select', false, [
                                    { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
                                    { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
                                    { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
                                    { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' }
                                ])}

                                <div className="space-y-2 text-left">
                                    <label className="block text-[13px] font-bold text-gray-900 dark:text-gray-300 mb-1.5 focus:outline-none">
                                        Allergies
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={allergyInput}
                                            onChange={(e) => setAllergyInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' ? (e.preventDefault(), addItem('allergies', allergyInput, setAllergyInput)) : null}
                                            placeholder="e.g., Peanuts, Penicillin"
                                            className="flex-grow h-11 px-4 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                        <button type="button" onClick={() => addItem('allergies', allergyInput, setAllergyInput)} className="h-11 px-4 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-sm flex items-center justify-center">
                                            <FiPlus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.allergies || '').split(',').map(s => s.trim()).filter(Boolean).map((item, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/40 rounded-full text-xs font-medium group transition-all animate-in zoom-in-95 duration-200">
                                                {item}
                                                <button type="button" onClick={() => removeItem('allergies', idx)} className="hover:text-red-900 dark:hover:text-red-100 transition-colors">
                                                    <FiX className="w-3.5 h-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    {renderField('Medical Condition', 'medical_condition', 'textarea', false, null, null, 'e.g., Asthma, Diabetes, Hypertension')}
                                </div>

                                <div className="md:col-span-2 space-y-2 text-left">
                                    <label className="block text-[13px] font-bold text-gray-900 dark:text-gray-300 mb-1.5 focus:outline-none">
                                        Disabilities / Special Needs
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={disabilityInput}
                                            onChange={(e) => setDisabilityInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' ? (e.preventDefault(), addItem('disabilities', disabilityInput, setDisabilityInput)) : null}
                                            placeholder="Enter disability or special need"
                                            className="flex-grow h-11 px-4 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                        <button type="button" onClick={() => addItem('disabilities', disabilityInput, setDisabilityInput)} className="h-11 px-4 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-sm flex items-center justify-center">
                                            <FiPlus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.disabilities || '').split(',').map(s => s.trim()).filter(Boolean).map((item, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 rounded-full text-xs font-medium group transition-all animate-in zoom-in-95 duration-200">
                                                {item}
                                                <button type="button" onClick={() => removeItem('disabilities', idx)} className="hover:text-purple-900 dark:hover:text-purple-100 transition-colors">
                                                    <FiX className="w-3.5 h-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Sports & Activities */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold ring-1 ring-brand-500/20">05</span>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest">Sports & Activities</h3>
                                <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent ml-2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-11">
                                <div className="md:col-span-2 text-left">
                                    <label className="block text-[13px] font-bold text-gray-900 dark:text-gray-300 mb-2.5 uppercase tracking-widest">
                                        Sports & Activities Played
                                    </label>
                                    <div className="flex flex-wrap gap-2 p-5 bg-gray-50/50 dark:bg-[#18181B]/30 border border-gray-200 dark:border-gray-800 rounded-2xl">
                                        {PREDEFINED_ACTIVITIES.map((activity, index) => {
                                            const isActive = (formData.sportsPlayed || '').split(',').map(s => s.trim()).includes(activity);
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => toggleActivity(activity)}
                                                    className={`px-3.5 py-2 rounded-xl border text-[13px] font-medium transition-all duration-200 ${isActive
                                                        ? 'bg-[#F97316] text-white border-[#F97316] shadow-sm shadow-[#F97316]/20'
                                                        : 'bg-white dark:bg-[#252525] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-500/50 dark:hover:border-orange-500/50'
                                                        }`}
                                                >
                                                    {activity}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">Click on the activities to toggle selection.</p>
                                </div>
                                {renderField('Achievements & Awards', 'athleticAchievements', 'text', false, null, 'Separate with commas', 'e.g., Regional Champion, MVP 2024')}
                                {renderField('Competitions Participated', 'competitions', 'text', false, null, 'Separate with commas', 'e.g., Intramurals 2023, District Meet')}
                            </div>
                        </div>

                        {/* 6. Organizations */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold ring-1 ring-brand-500/20">06</span>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest">Organizations & Leadership</h3>
                                <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent ml-2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-11">
                                {renderField('Clubs Joined', 'clubs', 'text', false, null, 'Separate with commas', 'e.g., IT Club, Coding Society, Red Cross')}
                                {renderField('Student Council', 'studentCouncil', 'text', false, null, 'Separate with commas', 'e.g., Year Representative, Officer')}
                                <div className="md:col-span-2">
                                    {renderField('Leadership Roles', 'leadershipRoles', 'text', false, null, 'Separate with commas', 'e.g., President, Secretary, Auditor')}
                                </div>
                            </div>
                        </div>

                        {/* 7. Behavior & Discipline */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold ring-1 ring-brand-500/20">07</span>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest">Behavior & Discipline</h3>
                                <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent ml-2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pl-11">
                                {renderField('Warnings', 'warnings', 'number', false, null, null, '0', 0)}
                                {renderField('Suspensions', 'suspensions', 'number', false, null, null, '0', 0)}
                                {renderField('Counseling Sessions', 'counseling', 'number', false, null, null, '0', 0)}
                                <div className="md:col-span-3">
                                    {renderField('Incidents', 'incidents', 'textarea', false, null, null, 'e.g., Late arrival, Unprofessional conduct')}
                                </div>
                                <div className="md:col-span-3">
                                    {renderField('Counseling Records', 'counseling_records', 'textarea', false, null, null, 'Summarize counseling outcomes or notes')}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="bg-gray-50 dark:bg-[#181818] border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-lg text-[14px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors flex items-center shadow-sm" disabled={isSaving}>Cancel</button>
                    <button type="submit" form="student-update-form" className="px-5 py-2.5 bg-[#F97316] text-white rounded-lg text-[14px] font-medium hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-60" disabled={isSaving}>
                        {isSaving ? <Spinner className="border-white/40 border-t-white" /> : <FiSave className="w-[18px] h-[18px]" />}
                        <span>{mode === 'create' ? 'Create Student' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentFormModal;