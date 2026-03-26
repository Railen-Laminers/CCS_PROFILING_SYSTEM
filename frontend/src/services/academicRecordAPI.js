import axios from 'axios';
import { authAPI } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authAPI.getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const academicRecordAPI = {
  // Get all academic records for a user
  getRecords: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}/academic-records`);
    return response.data.academic_records;
  },

  // Create a new academic record for a user
  createRecord: async (userId, recordData) => {
    const response = await axiosInstance.post(`/users/${userId}/academic-records`, recordData);
    return response.data.academic_record;
  },

  // Update a specific academic record
  updateRecord: async (recordId, recordData) => {
    const response = await axiosInstance.put(`/academic-records/${recordId}`, recordData);
    return response.data.academic_record;
  },

  // Delete a specific academic record
  deleteRecord: async (recordId) => {
    await axiosInstance.delete(`/academic-records/${recordId}`);
  }
};
