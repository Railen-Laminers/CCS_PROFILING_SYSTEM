import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { userAPI, facultyProfileAPI } from '../services/api';

const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
};

const useFaculty = () => {
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination state
    const [searchParams, setSearchParams] = useSearchParams();
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [tempSearchQuery, setTempSearchQuery] = useState(searchParams.get('search') || '');
    const [filters, setFilters] = useState({
        department: searchParams.get('department') || '',
        position: searchParams.get('position') || '',
        gender: searchParams.get('gender') || '',
    });

    // Debounced states for single-effect fetching
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const abortControllerRef = useRef(null);
    const isFirstMount = useRef(true);

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
        position: '',
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

    const syncUrlParams = useCallback((page, query, currentFilters) => {
        const params = new URLSearchParams();
        if (query) params.set('search', query);
        if (currentFilters.department) params.set('department', currentFilters.department);
        if (currentFilters.position) params.set('position', currentFilters.position);
        if (currentFilters.gender) params.set('gender', currentFilters.gender);
        if (page > 1) params.set('page', page.toString());
        setSearchParams(params, { replace: true });
    }, [setSearchParams]);

    const fetchFaculty = useCallback(async (page, query, currentFilters, signal) => {
        setLoading(true);
        try {
            const filterParams = {
                search: query || undefined,
                department: currentFilters.department || undefined,
                position: currentFilters.position || undefined,
                gender: currentFilters.gender || undefined,
                page,
            };

            const result = await facultyProfileAPI.searchFaculty(filterParams, signal);
            const freshFaculty = result.faculty || [];
            
            if (freshFaculty.length === 0 && page > 1 && result.meta?.total > 0) {
                setCurrentPage(prev => prev - 1);
                return;
            }

            setFaculty(freshFaculty);
            if (result.meta) setPagination(result.meta);
            setError('');
        } catch (err) {
            if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
                setError('Failed to fetch faculty.');
                console.error(err);
            }
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
                setIsSearching(false);
            }
        }
    }, []);

    const fetchDepartments = async () => {
        try {
            const data = await facultyProfileAPI.getDepartments();
            setDepartments(data.departments || []);
        } catch (err) {
            console.error('Failed to fetch departments:', err);
        }
    };

    const fetchPositions = async () => {
        try {
            const data = await facultyProfileAPI.getPositions();
            setPositions(data.positions || []);
        } catch (err) {
            console.error('Failed to fetch positions:', err);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery !== debouncedSearchQuery) {
                setDebouncedSearchQuery(searchQuery);
                setCurrentPage(1); 
            }
            if (JSON.stringify(filters) !== JSON.stringify(debouncedFilters)) {
                setDebouncedFilters(filters);
                setCurrentPage(1);
            }
        }, isFirstMount.current ? 0 : 300);

        return () => clearTimeout(handler);
    }, [searchQuery, filters]);

    useEffect(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        fetchFaculty(currentPage, debouncedSearchQuery, debouncedFilters, signal);
        syncUrlParams(currentPage, debouncedSearchQuery, debouncedFilters);
        
        isFirstMount.current = false;

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [currentPage, debouncedSearchQuery, debouncedFilters, fetchFaculty, syncUrlParams]);

    useEffect(() => {
        fetchDepartments();
        fetchPositions();
    }, []);

    const handleSearch = () => {
        setSearchQuery(tempSearchQuery);
        setIsSearching(true);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setTempSearchQuery('');
        setFilters({
            department: '',
            position: '',
            gender: '',
        });
        setCurrentPage(1);
        setSearchParams({}, { replace: true });
    };

    const fetchAllFaculty = async () => {
        try {
            const filterParams = {
                search: debouncedSearchQuery || undefined,
                department: debouncedFilters.department || undefined,
                position: debouncedFilters.position || undefined,
                gender: debouncedFilters.gender || undefined,
                paginate: 'false'
            };
            const result = await facultyProfileAPI.searchFaculty(filterParams);
            return result.faculty || [];
        } catch (err) {
            console.error('Failed to fetch all faculty for export:', err);
            return [];
        }
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
            position: '',
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
                position: formData.position,
                specialization: formData.specialization,
                subjects_handled: formData.subjects_handled ? formData.subjects_handled.split(',').map(s => s.trim()) : null,
                teaching_schedule: formData.teaching_schedule ? formData.teaching_schedule.split(',').map(s => s.trim()) : null,
                research_projects: formData.research_projects ? formData.research_projects.split(',').map(s => s.trim()) : null,
            };
            await userAPI.createUser(facultyData);
            refresh();
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
            position: f?.position || '',
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
                position: formData.position,
                specialization: formData.specialization,
                subjects_handled: formData.subjects_handled ? formData.subjects_handled.split(',').map(s => s.trim()) : null,
                teaching_schedule: formData.teaching_schedule ? formData.teaching_schedule.split(',').map(s => s.trim()) : null,
                research_projects: formData.research_projects ? formData.research_projects.split(',').map(s => s.trim()) : null,
            };
            if (formData.password) updateData.password = formData.password;
            await userAPI.updateUser(editingId, updateData);
            refresh();
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
            refresh();
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
            refresh();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${action} faculty.`);
        } finally {
            setTogglingUserId(null);
        }
    };

    const openCreateForm = () => {
        resetForm();
        setShowForm(true);
    };

    const refresh = () => {
        fetchFaculty(currentPage, debouncedSearchQuery, debouncedFilters);
        fetchDepartments();
        fetchPositions();
    };

    return {
        faculty,
        loading,
        error,
        pagination,
        currentPage,
        setCurrentPage,
        searchQuery,
        tempSearchQuery,
        setTempSearchQuery,
        filters,
        setFilters,
        departments,
        positions,
        isSearching,
        handleSearch,
        clearFilters,
        fetchAllFaculty,
        formMode,
        formData,
        fieldErrors,
        touched,
        editingId,
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
        refresh,
    };
};

export default useFaculty;
