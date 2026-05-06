import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration and global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        useAuthStore.getState().logout();
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        toast.error('Access Forbidden: Insufficient privileges.');
      } else if (error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error('An unexpected server error occurred.');
      }
    } else {
      toast.error('Network Error: Unable to reach the server.');
    }
    return Promise.reject(error);
  }
);

export default api;
