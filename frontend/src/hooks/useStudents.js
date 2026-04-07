import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { userAPI, studentProfileAPI } from '../services/api';

export const useStudents = () => {
    const { showToast } = useToast();
    const [students, setStudents] = useState([]);
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
        sports: searchParams.getAll('sports') || [],
        organizations: searchParams.getAll('organizations') || [],
        skills: searchParams.getAll('skills') || [],
        year_level: searchParams.get('year_level') || '',
        program: searchParams.get('program') || '',
        gender: searchParams.get('gender') || '',
        gpa_min: searchParams.get('gpa_min') || '',
        gpa_max: searchParams.get('gpa_max') || '',
    });
    const [tempFilters, setTempFilters] = useState({ ...filters });


    const [sports, setSports] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [skills, setSkills] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const abortControllerRef = useRef(null);
    const isFirstMount = useRef(true);

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

    const fetchSkills = async () => {
        try {
            const data = await studentProfileAPI.getSkills();
            setSkills(data || []);
        } catch (err) {
            console.error('Failed to fetch skills:', err);
        }
    };

    const syncUrlParams = useCallback((page, query, currentFilters) => {
        const params = new URLSearchParams();
        if (query) params.set('search', query);
        if (currentFilters.program) params.set('program', currentFilters.program);
        if (currentFilters.year_level) params.set('year_level', currentFilters.year_level);
        if (currentFilters.gender) params.set('gender', currentFilters.gender);
        if (currentFilters.gpa_min) params.set('gpa_min', currentFilters.gpa_min);
        if (currentFilters.gpa_max) params.set('gpa_max', currentFilters.gpa_max);
        currentFilters.sports.forEach(s => params.append('sports', s));
        currentFilters.organizations.forEach(o => params.append('organizations', o));
        currentFilters.skills.forEach(skill => params.append('skills', skill));
        if (page > 1) params.set('page', page.toString());
        setSearchParams(params, { replace: true });
    }, [setSearchParams]);

    const fetchStudents = useCallback(async (page, query, currentFilters, signal) => {
        setLoading(true);
        try {
            const filterParams = {
                search: query || undefined,
                sports: currentFilters.sports.length > 0 ? currentFilters.sports : undefined,
                organizations: currentFilters.organizations.length > 0 ? currentFilters.organizations : undefined,
                skills: currentFilters.skills.length > 0 ? currentFilters.skills : undefined,
                year_level: currentFilters.year_level ? parseInt(currentFilters.year_level) : undefined,
                program: currentFilters.program || undefined,
                gender: currentFilters.gender || undefined,
                gpa_min: currentFilters.gpa_min ? parseFloat(currentFilters.gpa_min) : undefined,
                gpa_max: currentFilters.gpa_max ? parseFloat(currentFilters.gpa_max) : undefined,
                page,
            };

            // Remove undefined values
            Object.keys(filterParams).forEach(key => {
                if (filterParams[key] === undefined) delete filterParams[key];
            });

            const result = await studentProfileAPI.searchStudents(filterParams, signal);
            const freshStudents = result.students || [];
            
            if (freshStudents.length === 0 && page > 1 && result.meta?.total > 0) {
                setCurrentPage(prev => prev - 1);
                return;
            }

            setStudents(freshStudents);
            if (result.meta) setPagination(result.meta);
            setError('');
        } catch (err) {
            if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
                showToast('Failed to fetch students.', 'error');
                console.error(err);
            }
        } finally {
            if (!signal.aborted) {
                setLoading(false);
                setIsSearching(false);
            }
        }
    }, [showToast]);


    useEffect(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        fetchStudents(currentPage, searchQuery, filters, signal);
        syncUrlParams(currentPage, searchQuery, filters);
        
        isFirstMount.current = false;

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [currentPage, searchQuery, filters]);

    useEffect(() => {
        fetchSports();
        fetchOrganizations();
        fetchSkills();
    }, []);

    const handleSearch = () => {
        setSearchQuery(tempSearchQuery);
        setFilters({ ...tempFilters });
        setIsSearching(true);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        const emptyFilters = {
            sports: [],
            organizations: [],
            skills: [],
            year_level: '',
            program: '',
            gender: '',
            gpa_min: '',
            gpa_max: '',
        };
        setSearchQuery('');
        setTempSearchQuery('');
        setFilters(emptyFilters);
        setTempFilters(emptyFilters);
        setCurrentPage(1);
        setSearchParams({}, { replace: true });
    };

    const fetchAllStudents = async () => {
        try {
            const filterParams = {
                search: searchQuery || undefined,
                sports: filters.sports.length > 0 ? filters.sports : undefined,
                organizations: filters.organizations.length > 0 ? filters.organizations : undefined,
                skills: filters.skills.length > 0 ? filters.skills : undefined,
                year_level: filters.year_level ? parseInt(filters.year_level) : undefined,
                program: filters.program || undefined,
                gender: filters.gender || undefined,
                gpa_min: filters.gpa_min ? parseFloat(filters.gpa_min) : undefined,
                gpa_max: filters.gpa_max ? parseFloat(filters.gpa_max) : undefined,
                paginate: 'false'
            };

            // Remove undefined values
            Object.keys(filterParams).forEach(key => {
                if (filterParams[key] === undefined) delete filterParams[key];
            });

            const result = await studentProfileAPI.searchStudents(filterParams);
            return result.students || [];
        } catch (err) {
            showToast('Failed to fetch all students for export.', 'error');
            console.error(err);
            return [];
        }
    };

    return {
        students,
        loading,
        error,
        pagination,
        currentPage,
        setCurrentPage,
        searchQuery,
        tempSearchQuery,
        setTempSearchQuery,
        tempFilters,
        setTempFilters,
        filters,
        sports,
        organizations,
        skills,
        isSearching,
        handleSearch,
        clearFilters,
        fetchAllStudents,
        refresh: () => {
            const signal = new AbortController().signal;
            fetchStudents(currentPage, searchQuery, filters, signal);
            fetchSports();
            fetchOrganizations();
            fetchSkills();
        },
        fetchSports,
        fetchOrganizations,
        fetchSkills
    };
};

export default useStudents;
