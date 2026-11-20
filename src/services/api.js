import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pulsefit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiration or errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired or unauthorized
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        // localStorage.removeItem('pulsefit_token');
        // localStorage.removeItem('pulsefit_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/password', data),
};

// Workouts Endpoints
export const workoutAPI = {
  getAll: (params) => api.get('/workouts', { params }),
  getById: (id) => api.get(`/workouts/${id}`),
  create: (data) => api.post('/workouts', data),
  update: (id, data) => api.put(`/workouts/${id}`, data),
  delete: (id) => api.delete(`/workouts/${id}`),
};

// Nutrition Endpoints
export const nutritionAPI = {
  getAll: (params) => api.get('/nutrition', { params }),
  create: (data) => api.post('/nutrition', data),
  update: (id, data) => api.put(`/nutrition/${id}`, data),
  delete: (id) => api.delete(`/nutrition/${id}`),
};

// Progress Endpoints
export const progressAPI = {
  getAll: () => api.get('/progress'),
  create: (data) => api.post('/progress', data),
  delete: (id) => api.delete(`/progress/${id}`),
};

// Goals Endpoints
export const goalAPI = {
  getAll: () => api.get('/goals'),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Reminders Endpoints
export const reminderAPI = {
  getAll: () => api.get('/reminders'),
  create: (data) => api.post('/reminders', data),
  update: (id, data) => api.put(`/reminders/${id}`, data),
  delete: (id) => api.delete(`/reminders/${id}`),
};

// Analytics Endpoints
export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getTrends: (period) => api.get('/analytics/trends', { params: { period } }),
};

// Notifications Endpoints
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Community / Forum Endpoints
export const communityAPI = {
  getUsers: () => api.get('/community/users'),
  toggleFollow: (userId) => api.post(`/community/follow/${userId}`),
  getPosts: () => api.get('/community/posts'),
  createPost: (data) => api.post('/community/posts', data),
  likePost: (postId) => api.post(`/community/posts/${postId}/like`),
  addResponse: (postId, data) => api.post(`/community/posts/${postId}/responses`, data),
};

// Support & Feedback Endpoints
export const supportAPI = {
  submitFeedback: (data) => api.post('/support/feedback', data),
};

export default api;
