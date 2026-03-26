// api.js (extended)
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

// Auth API
export const authAPI = {
  login: async (identifier, password) => {
    const response = await axiosInstance.post('/auth/login', { identifier, password });
    setAuthToken(response.data.token);
    return response.data.user; // already includes profile for student/faculty
  },
  logout: async () => {
    await axiosInstance.post('/auth/logout');
    removeAuthToken();
  },
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data.user; // includes profile for student/faculty
  },
  isAuthenticated,
  getAuthToken,
};

// User Management API (admin only)
export const userAPI = {
  // Create a new user (student or faculty)
  createUser: async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data; // returns { message, user, student/faculty }
  },

  // Get all users
  getUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data.users;
  },

  // Get single user by ID or their username
  getUser: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data.user;
  },

  // Update a user
  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data; // returns { message, user, student/faculty }
  },

  // Delete a user
  deleteUser: async (id) => {
    await axiosInstance.delete(`/users/${id}`);
  },

  // Get all students
  getStudents: async () => {
    const response = await axiosInstance.get('/students');
    return response.data.students; // array of { user, student }
  },

  // Get all faculty
  getFaculty: async () => {
    const response = await axiosInstance.get('/faculty');
    return response.data.faculty; // array of { user, faculty }
  },

  // Get all courses
  getCourses: async () => {
    const response = await axiosInstance.get('/courses');
    return response.data.courses;
  },

  // Get a single course by ID or code
  getCourse: async (id) => {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data.course;
  },

  // Create a new course
  createCourse: async (courseData) => {
    const response = await axiosInstance.post('/courses', courseData);
    return response.data.course;
  },

  // Update an existing course
  updateCourse: async (id, courseData) => {
    const response = await axiosInstance.put(`/courses/${id}`, courseData);
    return response.data.course;
  },

  // Delete a course
  deleteCourse: async (id) => {
    await axiosInstance.delete(`/courses/${id}`);
  },

  // Get all events
  getEvents: async () => {
    const response = await axiosInstance.get('/events');
    return response.data.events;
  },

  // Academic Records
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

export default authAPI;