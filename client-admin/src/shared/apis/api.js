import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';
// 1. Instancia para Autenticación
const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Instancia para Administración (la que usará el token)
const axiosAdmin = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// INTERCEPTOR DE PETICIÓN: Para adjuntar el Token
// Esto garantiza el criterio de "Seguridad básica" de tu sprint
const requestInterceptor = (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

axiosAuth.interceptors.request.use(requestInterceptor);
axiosAdmin.interceptors.request.use(requestInterceptor);

// Si el servidor responde 401, cerramos sesión
const responseInterceptor = (res) => res;
const errorInterceptor = (error) => {
    if (error.response?.status === 401) {
        useAuthStore.getState().logout();
    }
    return Promise.reject(error);
};

axiosAuth.interceptors.response.use(responseInterceptor, errorInterceptor);
axiosAdmin.interceptors.response.use(responseInterceptor, errorInterceptor);

export { axiosAuth, axiosAdmin };