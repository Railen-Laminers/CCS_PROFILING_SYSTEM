import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { facultyProfileAPI } from '../services/api';

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

    // Grid action states
    const [deletingUserId, setDeletingUserId] = useState(null);

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
        deletingUserId,
        setDeletingUserId,
        refresh,
    };
};

export default useFaculty;
