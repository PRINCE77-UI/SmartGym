import axios from 'axios';

// Determine API base URL based on environment
const API_BASE_URL = 
  process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost'
    ? `${window.location.origin}/api`
    : 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
