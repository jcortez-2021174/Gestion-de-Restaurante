import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

/* ================================
   CONFIG BASE URL (CRÍTICO)
================================ */
const AUTH_URL =
    import.meta.env.VITE_AUTH_URL || 'http://localhost:5022/api';

const ADMIN_URL =
    import.meta.env.VITE_ADMIN_URL || 'http://localhost:5022/api';

console.log("AUTH URL:", AUTH_URL);

/* ================================
   INSTANCIAS AXIOS
================================ */
const axiosAuth = axios.create({
    baseURL: AUTH_URL,
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const axiosAdmin = axios.create({
    baseURL: ADMIN_URL,
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json'
    }
});

/* ================================
   INTERCEPTOR REQUEST (TOKEN)
================================ */
const requestInterceptor = (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

axiosAuth.interceptors.request.use(requestInterceptor);
axiosAdmin.interceptors.request.use(requestInterceptor);

/* ================================
   INTERCEPTOR RESPONSE
================================ */
const responseInterceptor = (response) => response;

const errorInterceptor = (error) => {
    console.error("AXIOS ERROR:", error);

    if (error.response) {
        console.error("RESPONSE DATA:", error.response.data);
        console.error("STATUS:", error.response.status);
    } else {
        console.error("NO RESPONSE (posible CORS o backend apagado)");
    }

    // Auto logout si token inválido
    if (error.response?.status === 401) {
        console.warn("Token inválido → logout automático");
        useAuthStore.getState().logout();
    }

    return Promise.reject(error);
};

axiosAuth.interceptors.response.use(responseInterceptor, errorInterceptor);
axiosAdmin.interceptors.response.use(responseInterceptor, errorInterceptor);

/* ================================
   EXPORTS
================================ */
export { axiosAuth, axiosAdmin };

