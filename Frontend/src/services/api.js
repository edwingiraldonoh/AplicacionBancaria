import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});

// Interceptor para logging de requests
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('⚠️ Backend no está corriendo en localhost:8080');
    }
    
    return Promise.reject(error);
  }
);

export default api;