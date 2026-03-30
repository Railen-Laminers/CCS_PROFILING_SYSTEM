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
        year_level: searchParams.get('year_level') || '',
        program: searchParams.get('program') || '',
        gender: searchParams.get('gender') || '',
        gpa_min: searchParams.get('gpa_min') || '',
        gpa_max: searchParams.get('gpa_max') || '',
    });

    // Debounced states for single-effect fetching
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    const [sports, setSports] = useState([]);
    const [organizations, setOrganizations] = useState([]);
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
            setStudents(result.students || []);
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

        fetchStudents(currentPage, debouncedSearchQuery, debouncedFilters, signal);
        syncUrlParams(currentPage, debouncedSearchQuery, debouncedFilters);
        
        isFirstMount.current = false;

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [currentPage, debouncedSearchQuery, debouncedFilters]);

    useEffect(() => {
        fetchSports();
        fetchOrganizations();
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
        filters,
        setFilters,
        sports,
        organizations,
        isSearching,
        handleSearch,
        clearFilters,
        refresh: () => fetchStudents(currentPage, debouncedSearchQuery, debouncedFilters, new AbortController().signal),
        fetchSports,
        fetchOrganizations
    };
};

export default useStudents;
