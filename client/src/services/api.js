import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('downtube-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('downtube-token')
      window.location.href = '/'
    }
    
    if (error.response?.status === 429) {
      // Rate limit exceeded
      console.warn('Rate limit exceeded')
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
}

// Download API
export const downloadAPI = {
  getVideoInfo: (url) => api.post('/download/info', { url }),
  downloadVideo: (url, formatId, quality) => 
    api.post('/download/start', { url, formatId, quality }, { 
      responseType: 'blob',
      timeout: 300000, // 5 minutes for downloads
    }),
  getHistory: () => api.get('/download/history'),
  deleteHistoryItem: (id) => api.delete(`/download/history/${id}`),
}

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (profileData) => api.put('/user/profile', profileData),
  getDownloadStats: () => api.get('/user/stats'),
  getSettings: () => api.get('/user/settings'),
  updateSettings: (settings) => api.put('/user/settings', settings),
}

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
}

export default api
