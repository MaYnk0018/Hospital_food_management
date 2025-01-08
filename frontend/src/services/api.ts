// src/services/api.ts
import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Something went wrong';
    toast.error(message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Type-safe API functions
export const apiService = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    },
    getProfile: async () => {
      const response = await api.get('/auth/me');
      return response.data;
    },
  },
  patients: {
    getAll: async () => {
      const response = await api.get('/patients');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/patients', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/patients/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/patients/${id}`);
      return response.data;
    },
  },
  // Add other API endpoints as needed
};