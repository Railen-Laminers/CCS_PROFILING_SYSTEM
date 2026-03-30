import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { userAPI, studentProfileAPI } from '../../../services/api';
import { exportToExcel } from '../../../lib/excelHelper';
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
    FiTarget,
    FiFilter,
    FiPower,
} from 'react-icons/fi';
import { Spinner } from '@/components/ui/Skeleton';
import StudentFormModal from '../../../components/forms/StudentFormModal';

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
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [modalData, setModalData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [togglingUserId, setTogglingUserId] = useState(null);   // For status toggle

    // Search and filter states
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [tempSearchQuery, setTempSearchQuery] = useState(searchParams.get('search') || ''); // Local buffer for typing
    const [filters, setFilters] = useState({
        sports: searchParams.getAll('sports') || [],
        organizations: searchParams.getAll('organizations') || [],
        year_level: searchParams.get('year_level') || '',
        program: searchParams.get('program') || '',
        gender: searchParams.get('gender') || '',
        gpa_min: searchParams.get('gpa_min') || '',
        gpa_max: searchParams.get('gpa_max') || '',
    });
    const [sports, setSports] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
    const debounceTimer = useRef(null);

    if (user?.role !== 'admin') {
        return <div className="p-6 text-red-500 dark:text-red-400">You do not have permission to view this page.</div>;
    }

    const fetchStudents = async (page = 1, query = searchQuery) => {
        setLoading(true);
        try {
            const filterParams = {
                search: query || undefined,
                sports: filters.sports.length > 0 ? filters.sports : undefined,
                organizations: filters.organizations.length > 0 ? filters.organizations : undefined,
                year_level: filters.year_level ? parseInt(filters.year_level) : undefined,
                program: filters.program || undefined,
                gender: filters.gender || undefined,
                gpa_min: filters.gpa_min ? parseFloat(filters.gpa_min) : undefined,
                gpa_max: filters.gpa_max ? parseFloat(filters.gpa_max) : undefined,
                page,
            };
            // Remove undefined values
            Object.keys(filterParams).forEach(key => {
                if (filterParams[key] === undefined) delete filterParams[key];
            });
            const result = await studentProfileAPI.searchStudents(filterParams);
            setStudents(result.students || []);
            if (result.meta) setPagination(result.meta);
            setError('');
        } catch (err) {
            showToast('Failed to fetch students.', 'error');
            console.error(err);
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    const fetchSports = async () => {
        try {
            const data = await studentProfileAPI.getSports();
            setSports(data.sports || []);
        } catch (err) {
            console.error('Failed to fetch sports:', err);
        }
    };

    const fetchOrganizations = async () => {
        try {
            const data = await studentProfileAPI.getOrganizations();
            setOrganizations(data.organizations || []);
        } catch (err) {
            console.error('Failed to fetch organizations:', err);
        }
    };

    const handleSearch = () => {
        setSearchQuery(tempSearchQuery);
        setIsSearching(true);
        setCurrentPage(1);
        fetchStudents(1, tempSearchQuery);
        syncUrlParams(1, tempSearchQuery);
    };

    const syncUrlParams = (page = currentPage, query = searchQuery) => {
        const params = new URLSearchParams();
        if (query) params.set('search', query);
        if (filters.program) params.set('program', filters.program);
        if (filters.year_level) params.set('year_level', filters.year_level);
        if (filters.gender) params.set('gender', filters.gender);
        if (filters.gpa_min) params.set('gpa_min', filters.gpa_min);
        if (filters.gpa_max) params.set('gpa_max', filters.gpa_max);
        filters.sports.forEach(s => params.append('sports', s));
        filters.organizations.forEach(o => params.append('organizations', o));
        if (page > 1) params.set('page', page.toString());
        setSearchParams(params, { replace: true });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setTempSearchQuery('');
        setFilters({
            sports: [],
            organizations: [],
            year_level: '',
            program: '',
            gender: '',
            gpa_min: '',
            gpa_max: '',
        });
        setCurrentPage(1);
        setSearchParams({}, { replace: true });
    };

    // Live filters: auto-search when dropdowns change
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setCurrentPage(1);
            fetchStudents(1);
            syncUrlParams(1);
        }, 300);
        return () => clearTimeout(debounceTimer.current);
    }, [filters]); 

    // Page change
    useEffect(() => {
        fetchStudents(currentPage);
        syncUrlParams(currentPage);
    }, [currentPage]);

    // Load filter options on mount
    useEffect(() => {
        fetchSports();
        fetchOrganizations();
    }, []);

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

    const handleUpdate = async (e) => {
        // Obsolete handles, logic moved to StudentFormModal
    };

    const handleDelete = async (userId) => {
        const selectedStudent = students.find(s => s.user.id === userId);
        const studentName = `${selectedStudent?.user.firstname} ${selectedStudent?.user.lastname}`;
        if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) return;

        setDeletingUserId(userId);
        setError('');
        try {
            await userAPI.deleteUser(userId);
            await fetchStudents(currentPage);
            await fetchSports();
            await fetchOrganizations();
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
        setError('');
        try {
            await userAPI.updateUser(student.user.id, { is_active: newStatus });
            await fetchStudents(currentPage);
            await fetchSports();
            await fetchOrganizations();
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

            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <StudentFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                initialData={modalData}
                userId={editingId}
                onSuccess={() => {
                    fetchStudents(currentPage);
                    fetchSports();
                    fetchOrganizations();
                    showToast(`Student ${modalMode === 'create' ? 'created' : 'updated'} successfully.`, 'success');
                }}
            />

            {/* Search Bar and Filters */}
            <div className="bg-white/60 dark:bg-surface-secondary/40 backdrop-blur-2xl rounded-[2rem] shadow-sm border border-zinc-200/50 dark:border-white/5 p-5 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/80 dark:ring-white/10 pointer-events-none"></div>
                <div className="flex flex-col lg:flex-row gap-4 relative z-10">
                    <div className="relative w-full max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-500 w-5 h-5 pointer-events-none" />
                        <input 
                            type="text" 
                            value={tempSearchQuery}
                            onChange={(e) => setTempSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search by name or student ID..." 
                            className="w-full h-10 pl-11 pr-4 bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl text-sm text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm transition-colors" 
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="flex items-center justify-center min-w-[100px] h-10 px-4 bg-brand-500 text-white rounded-xl text-sm font-medium transition-all hover:bg-brand-400 active:scale-95 disabled:opacity-60 shadow-sm"
                    >
                        {isSearching ? <Spinner className="border-white" /> : <span>Search</span>}
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 h-10 px-4 border rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm ${
                            showFilters 
                                ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-300 dark:border-brand-500/30 text-brand-700 dark:text-brand-400' 
                                : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-border-dark text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-surface-secondary'
                        }`}
                    >
                        <FiFilter className="w-5 h-5" />
                        <span>Filters</span>
                        {(filters.sports.length > 0 || filters.organizations.length > 0 || filters.year_level || filters.program || filters.gender || filters.gpa_min || filters.gpa_max) && (
                            <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                                {(filters.sports.length || 0) + (filters.organizations.length || 0) + (filters.year_level ? 1 : 0) + (filters.program ? 1 : 0) + (filters.gender ? 1 : 0) + (filters.gpa_min ? 1 : 0) + (filters.gpa_max ? 1 : 0)}
                            </span>
                        )}
                    </button>
                    {(searchQuery || filters.sports.length > 0 || filters.organizations.length > 0 || filters.year_level || filters.program || filters.gender || filters.gpa_min || filters.gpa_max) && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 h-[38px] px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-sm font-medium transition-colors"
                        >
                            <FiX className="w-5 h-5" />
                            <span>Clear</span>
                        </button>
                    )}
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Sports Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sports</label>
                                <select 
                                    multiple
                                    value={filters.sports}
                                    onChange={(e) => setFilters({...filters, sports: Array.from(e.target.selectedOptions, option => option.value)})}
                                    className="w-full h-[80px] px-3 py-2 bg-[#F3F3F5] dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                >
                                    {sports.map((sport, idx) => (
                                        <option key={idx} value={sport}>{sport}</option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple</p>
                            </div>

                            {/* Organizations Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organizations</label>
                                <select 
                                    multiple
                                    value={filters.organizations}
                                    onChange={(e) => setFilters({...filters, organizations: Array.from(e.target.selectedOptions, option => option.value)})}
                                    className="w-full h-[80px] px-3 py-2 bg-[#F3F3F5] dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                >
                                    {organizations.map((org, idx) => (
                                        <option key={idx} value={org}>{org}</option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple</p>
                            </div>

                            {/* Year Level Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year Level</label>
                                <select 
                                    value={filters.year_level}
                                    onChange={(e) => setFilters({...filters, year_level: e.target.value})}
                                    className="w-full h-[38px] px-3 py-1.5 bg-[#F3F3F5] dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                >
                                    <option value="">All Years</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>

                            {/* Program Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program</label>
                                <select 
                                    value={filters.program}
                                    onChange={(e) => setFilters({...filters, program: e.target.value})}
                                    className="w-full h-[38px] px-3 py-1.5 bg-[#F3F3F5] dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                >
                                    <option value="">All Programs</option>
                                    <option value="BSCS">BS Computer Science</option>
                                    <option value="BSIT">BS Information Technology</option>
                                </select>
                            </div>

                            {/* Gender Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                                <select 
                                    value={filters.gender}
                                    onChange={(e) => setFilters({...filters, gender: e.target.value})}
                                    className="w-full h-[38px] px-3 py-1.5 bg-[#F3F3F5] dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                >
                                    <option value="">All Genders</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* GPA Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GPA Range</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        step="0.1"
                                        min="0"
                                        max="4"
                                        value={filters.gpa_min}
                                        onChange={(e) => setFilters({...filters, gpa_min: e.target.value})}
                                        placeholder="Min"
                                        className="w-1/2 h-[38px] px-3 py-1.5 bg-[#F3F3F5] dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                    <input 
                                        type="number" 
                                        step="0.1"
                                        min="0"
                                        max="4"
                                        value={filters.gpa_max}
                                        onChange={(e) => setFilters({...filters, gpa_max: e.target.value})}
                                        placeholder="Max"
                                        className="w-1/2 h-[38px] px-3 py-1.5 bg-[#F3F3F5] dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Students Table */}
            <div className="bg-white/60 dark:bg-surface-secondary/30 backdrop-blur-2xl rounded-[2rem] shadow-sm border border-zinc-200/50 dark:border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/80 dark:ring-white/10 pointer-events-none"></div>
                {loading ? (
                    <div className="flex justify-center items-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div></div>
                ) : students.length === 0 ? (
                    <div className="text-center py-16 text-sm text-gray-500 dark:text-zinc-400 flex flex-col items-center"><FiUsers className="w-12 h-12 text-gray-300 dark:text-zinc-700 mb-3" /><p>No students found in the database.</p></div>
                ) : (
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-border-dark">
                                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[7%]">Photo</th>
                                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[12%]">Student ID</th>
                                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[18%]">Name</th>
                                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[18%]">Program</th>
                                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[10%]">Year Level</th>
                                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[10%]">Section</th>
                                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[10%]">Status</th>
                                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 text-left w-[15%]">Actions</th>
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
                                            className="hover:bg-brand-500/10 transition-all duration-200 h-[64px] cursor-pointer group hover:shadow-[inset_0_0_20px_rgba(249,115,22,0.05)] relative z-10"
                                        >
                                            <td className="py-2 px-1 pr-4 whitespace-nowrap pl-2">
                                                <div className="w-9 h-9 rounded-[10px] bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-[13px] font-bold border border-brand-200 dark:border-brand-500/20 shadow-sm">
                                                    {initials}
                                                </div>
                                            </td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-900 dark:text-gray-100 font-medium">{student.user.user_id}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100 transition-colors">{fullName}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-zinc-400">{student.student?.program || 'N/A'}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-zinc-400">{student.student?.year_level ? `${student.student.year_level} Year` : 'N/A'}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-zinc-400">{student.student?.section || 'N/A'}</td>
                                            <td className="py-2 pr-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-gray-100 dark:bg-zinc-500/10 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-500/20'}`}>
                                                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
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

            {/* Pagination */}
            {!loading && students.length > 0 && pagination.last_page > 1 && (
                <div className="flex items-center justify-between mt-5 px-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{((pagination.current_page - 1) * pagination.per_page) + 1}</span>
                        -<span className="font-semibold text-gray-800 dark:text-gray-200">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> of{' '}
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{pagination.total}</span> students
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={pagination.current_page <= 1}
                            className="px-3 py-1.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                            let page;
                            if (pagination.last_page <= 5) {
                                page = i + 1;
                            } else if (pagination.current_page <= 3) {
                                page = i + 1;
                            } else if (pagination.current_page >= pagination.last_page - 2) {
                                page = pagination.last_page - 4 + i;
                            } else {
                                page = pagination.current_page - 2 + i;
                            }
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 text-sm font-medium rounded-xl transition-colors ${
                                        page === pagination.current_page
                                            ? 'bg-brand-500 text-white shadow-sm'
                                            : 'border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-surface-secondary'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))}
                            disabled={pagination.current_page >= pagination.last_page}
                            className="px-3 py-1.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Total count when not paginated */}
            {!loading && students.length > 0 && pagination.last_page <= 1 && (
                <div className="mt-4 px-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{pagination.total}</span> student{pagination.total !== 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
};

export default StudentPage;
