import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://financeandsplit-1.onrender.com' : 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
};

export const transactionsAPI = {
  getAll: () => api.get('/transactions/'),
  create: (transaction) => api.post('/transactions/', transaction),
  update: (id, transaction) => api.put(`/transactions/${id}`, transaction),
  delete: (id) => api.delete(`/transactions/${id}`),
  getAnalytics: () => api.get('/transactions/analytics'),
};

export const groupsAPI = {
  getAll: () => api.get('/groups/'),
  create: (group) => api.post('/groups/', group),
  update: (id, group) => api.put(`/groups/${id}`, group),
  delete: (id) => api.delete(`/groups/${id}`),
  addMember: (groupId, member) => api.post(`/groups/${groupId}/members`, member),
  removeMember: (groupId, memberId) => api.delete(`/groups/${groupId}/members/${memberId}`),
};

export const expensesAPI = {
  getAll: () => api.get('/expenses/'),
  create: (expense) => api.post('/expenses/', expense),
  update: (id, expense) => api.put(`/expenses/${id}`, expense),
  delete: (id) => api.delete(`/expenses/${id}`),
  split: (expenseId, splitData) => api.post(`/expenses/${expenseId}/split`, splitData),
};

export default api;
