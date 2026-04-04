import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper functions
// const getAuthToken = () => localStorage.getItem('authToken');
// const setAuthToken = (token) => localStorage.setItem('authToken', token);
// const removeAuthToken = () => localStorage.removeItem('authToken');
const getAuthToken = () => sessionStorage.getItem('authToken');
const setAuthToken = (token) => sessionStorage.setItem('authToken', token);
const removeAuthToken = () => sessionStorage.removeItem('authToken');
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
    
    // Let the browser set Content-Type with boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
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
  getMe: async (signal) => {
    const response = await axiosInstance.get('/auth/me', { signal });
    return response.data.user;
  },
  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (resetData) => {
    const response = await axiosInstance.post('/auth/reset-password', resetData);
    return response.data;
  },
  isAuthenticated,
  getAuthToken,
};

// ─── User API ────────────────────────────────────────────────────────────────

export const userAPI = {
  getUsers: async (signal) => {
    const response = await axiosInstance.get('/users', { signal });
    return response.data.users;
  },
  getUser: async (id, signal) => {
    const response = await axiosInstance.get(`/users/${id}`, { signal });
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
  getStudents: async (signal) => {
    const response = await axiosInstance.get('/students', { signal });
    return response.data.students;
  },
  getFaculty: async (signal) => {
    const response = await axiosInstance.get('/faculty', { signal });
    return response.data.faculty;
  },
};

// ─── Course API ──────────────────────────────────────────────────────────────

export const courseAPI = {
  getCourses: async (signal) => {
    const response = await axiosInstance.get('/courses', { signal });
    return response.data.courses;
  },
  getCourse: async (id, signal) => {
    const response = await axiosInstance.get(`/courses/${id}`, { signal });
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
  getEvents: async (signal) => {
    const response = await axiosInstance.get('/events', { signal });
    return response.data.events;
  },
  createEvent: async (eventData) => {
    const response = await axiosInstance.post('/events', eventData);
    return response.data.event;
  },
  updateEvent: async (id, eventData) => {
    const response = await axiosInstance.put(`/events/${id}`, eventData);
    return response.data.event;
  },
  deleteEvent: async (id) => {
    await axiosInstance.delete(`/events/${id}`);
  },
  registerForEvent: async (eventId, userId) => {
    const response = await axiosInstance.post(`/events/${eventId}/register`, { user_id: userId });
    return response.data;
  },
  unregisterFromEvent: async (eventId, userId) => {
    const response = await axiosInstance.delete(`/events/${eventId}/register`, { data: { user_id: userId } });
    return response.data;
  },
  getStudentCurricularEvents: async (userId, signal) => {
    const response = await axiosInstance.get(`/events/student/${userId}/curricular`, { signal });
    return response.data.events;
  },
};

// ─── Academic Record API ─────────────────────────────────────────────────────

export const academicRecordAPI = {
  getAcademicRecords: async (userId, signal) => {
    const response = await axiosInstance.get(`/users/${userId}/academic-records`, { signal });
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
  getSections: async () => {
    const response = await axiosInstance.get('/students/sections');
    return response.data.sections;
  },
  searchStudents: async (params) => {
    const response = await axiosInstance.get('/students/search', { params });
    return response.data;
  },
  getSectionCount: async (section) => {
    const response = await axiosInstance.get('/students/section-count', { params: { section } });
    return response.data;
  },
};

// ─── Faculty Profile API (Search & Filter) ───────────────────────────────────

export const facultyProfileAPI = {
  getDepartments: async () => {
    const response = await axiosInstance.get('/faculty/departments');
    return response.data;
  },
  getPositions: async () => {
    const response = await axiosInstance.get('/faculty/positions');
    return response.data;
  },
  searchFaculty: async (params, signal) => {
    const response = await axiosInstance.get('/faculty/search', { params, signal });
    return response.data;
  },
};

// ─── Contact API ─────────────────────────────────────────────────────────────

export const contactAPI = {
  sendInquiry: async (contactData) => {
    const response = await axiosInstance.post('/contact', contactData);
    return response.data;
  },
};

// ─── Room API ────────────────────────────────────────────────────────────────
export const roomAPI = {
  getRooms: async (signal) => {
    const response = await axiosInstance.get('/rooms', { signal });
    return response.data;
  },
  createRoom: async (roomData) => {
    const response = await axiosInstance.post('/rooms', roomData);
    return response.data;
  },
  updateRoom: async (id, roomData) => {
    const response = await axiosInstance.put(`/rooms/${id}`, roomData);
    return response.data;
  },
  deleteRoom: async (id) => {
    await axiosInstance.delete(`/rooms/${id}`);
  },
};

// ─── Instruction API ─────────────────────────────────────────────────────────

export const instructionAPI = {
  getClasses: async (params, signal) => {
    const response = await axiosInstance.get('/instruction/classes', { params, signal });
    return response.data;
  },
  createClass: async (classData) => {
    const response = await axiosInstance.post('/instruction/classes', classData);
    return response.data;
  },
  updateClass: async (id, classData) => {
    const response = await axiosInstance.put(`/instruction/classes/${id}`, classData);
    return response.data;
  },
  deleteClass: async (id) => {
    await axiosInstance.delete(`/instruction/classes/${id}`);
  },
  getAssignments: async (signal) => {
    const response = await axiosInstance.get('/instruction/assignments', { signal });
    return response.data;
  },
  getLessonPlans: async (signal) => {
    const response = await axiosInstance.get('/instruction/lesson-plans', { signal });
    return response.data;
  },
  createLessonPlan: async (lessonData) => {
    const response = await axiosInstance.post('/instruction/lesson-plans', lessonData);
    return response.data;
  },
  deleteLessonPlan: async (id) => {
    await axiosInstance.delete(`/instruction/lesson-plans/${id}`);
  },
  getMaterials: async (signal) => {
    const response = await axiosInstance.get('/instruction/materials', { signal });
    return response.data;
  },
  createMaterial: async (materialData) => {
    const response = await axiosInstance.post('/instruction/materials', materialData);
    return response.data;
  },
  deleteMaterial: async (id) => {
    await axiosInstance.delete(`/instruction/materials/${id}`);
  },
};

export default authAPI;