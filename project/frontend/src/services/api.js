import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Check for admin token first, then regular token
    const adminToken = localStorage.getItem('adminToken');
    const token = localStorage.getItem('token');
    const authToken = adminToken || token;
    
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear both token types
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      const isAdminPage = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminPage ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  getUserProjects: () => api.get('/projects/user'),
};

export const userAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const investmentAPI = {
  createInvestment: (data) => api.post('/investments', data),
  getUserInvestments: () => api.get('/investments/user'),
  getProjectInvestments: (projectId) => api.get(`/investments/project/${projectId}`),
};

export default api; 