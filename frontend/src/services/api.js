import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper functions
const getAuthToken = () => localStorage.getItem('authToken');
const setAuthToken = (token) => localStorage.setItem('authToken', token);
const removeAuthToken = () => localStorage.removeItem('authToken');
const isAuthenticated = () => !!getAuthToken();

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

// Request interceptor: add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) removeAuthToken();
    return Promise.reject(error);
  }
);

// ─── Auth API ────────────────────────────────────────────────────────────────

export const authAPI = {
  login: async (identifier, password) => {
    const response = await axiosInstance.post('/auth/login', { identifier, password });
    setAuthToken(response.data.token);
    return response.data.user;
  },
  logout: async () => {
    await axiosInstance.post('/auth/logout');
    removeAuthToken();
  },
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data.user;
  },
  isAuthenticated,
  getAuthToken,
};

// ─── User API ────────────────────────────────────────────────────────────────

export const userAPI = {
  getUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data.users;
  },
  getUser: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data.user;
  },
  createUser: async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  },
  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    await axiosInstance.delete(`/users/${id}`);
  },
  getStudents: async () => {
    const response = await axiosInstance.get('/students');
    return response.data.students;
  },
  getFaculty: async () => {
    const response = await axiosInstance.get('/faculty');
    return response.data.faculty;
  },
};

// ─── Course API ──────────────────────────────────────────────────────────────

export const courseAPI = {
  getCourses: async () => {
    const response = await axiosInstance.get('/courses');
    return response.data.courses;
  },
  getCourse: async (id) => {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data.course;
  },
  createCourse: async (courseData) => {
    const response = await axiosInstance.post('/courses', courseData);
    return response.data.course;
  },
  updateCourse: async (id, courseData) => {
    const response = await axiosInstance.put(`/courses/${id}`, courseData);
    return response.data.course;
  },
  deleteCourse: async (id) => {
    await axiosInstance.delete(`/courses/${id}`);
  },
};

// ─── Event API ───────────────────────────────────────────────────────────────

export const eventAPI = {
  getEvents: async () => {
    const response = await axiosInstance.get('/events');
    return response.data.events;
  },
};

// ─── Academic Record API ─────────────────────────────────────────────────────

export const academicRecordAPI = {
  getAcademicRecords: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}/academic-records`);
    return response.data.academic_records;
  },
  createAcademicRecord: async (userId, recordData) => {
    const response = await axiosInstance.post(`/users/${userId}/academic-records`, recordData);
    return response.data.academic_record;
  },
  updateAcademicRecord: async (recordId, recordData) => {
    const response = await axiosInstance.put(`/academic-records/${recordId}`, recordData);
    return response.data.academic_record;
  },
  deleteAcademicRecord: async (recordId) => {
    await axiosInstance.delete(`/academic-records/${recordId}`);
  },
};

// ─── Student Profile API (Search & Filter) ───────────────────────────────────

export const studentProfileAPI = {
  getSports: async () => {
    const response = await axiosInstance.get('/students/sports');
    return response.data;
  },
  getOrganizations: async () => {
    const response = await axiosInstance.get('/students/organizations');
    return response.data;
  },
  searchStudents: async (params) => {
    const response = await axiosInstance.get('/students/search', { params });
    return response.data;
  },
};

export default authAPI;