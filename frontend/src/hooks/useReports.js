import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom hook to manage reports and analytics data fetching.
 */
export const useReports = () => {
    const [analyticsData, setAnalyticsData] = useState({
        enrollmentTrend: [],
        departmentStats: [],
        courseStats: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/reports/analytics`, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setAnalyticsData(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch analytics');
            }
        } catch (err) {
            console.error('Error in useReports:', err);
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return {
        analyticsData,
        loading,
        error,
        refresh: fetchAnalytics
    };
};
