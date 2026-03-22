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

// User Management API (admin only)
export const userAPI = {
  // Create a new user
  createUser: async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data.user;
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
    return response.data.user;
  },

  // Delete a user
  deleteUser: async (id) => {
    await axiosInstance.delete(`/users/${id}`);
  },

  // Get all students
  getStudents: async () => {
    const response = await axiosInstance.get('/students');
    return response.data.students;
  },

  // Get all faculty
  getFaculty: async () => {
    const response = await axiosInstance.get('/faculty');
    return response.data.faculty;
  },

  // Get all courses
  getCourses: async () => {
    const response = await axiosInstance.get('/courses');
    return response.data.courses;
  },

  // ADDED: Get all events
  getEvents: async () => {
    const response = await axiosInstance.get('/events');
    return response.data.events;
  },
};

export default authAPI;