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

    const [sports, setSports] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimer = useRef(null);

    const fetchStudents = useCallback(async (page = 1, query = searchQuery) => {
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
    }, [filters, searchQuery, showToast]);

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

    const syncUrlParams = useCallback((page = currentPage, query = searchQuery) => {
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
    }, [currentPage, searchQuery, filters, setSearchParams]);

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
        refresh: () => fetchStudents(currentPage),
        fetchSports,
        fetchOrganizations
    };
};
