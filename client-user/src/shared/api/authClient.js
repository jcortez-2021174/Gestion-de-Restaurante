// src/shared/api/authClient.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

const NO_REFRESH_ENDPOINTS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/resend-verification',
];

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  failedQueue = [];
};

const authClient = axios.create({
  baseURL: ENDPOINTS.AUTH,
  headers: {
    'Content-Type': 'application/json',
  },
});

authClient.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token;
  if (token && !config.url?.includes('/refresh')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest.url?.includes('/refresh');

    if (error.response?.status === 401 && !isRefreshRequest && !NO_REFRESH_ENDPOINTS.some((endpoint) => originalRequest.url?.includes(endpoint))) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = await SecureStore.getItemAsync('aurea_refresh_token');

        if (!refreshToken) {
          await useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(`${ENDPOINTS.AUTH}/refresh`, { refreshToken });
          const newAccessToken = response.data?.accessToken;
          const newUser = response.data?.user;
          const newRefreshToken = response.data?.refreshToken;
          if (newAccessToken) {
            useAuthStore.getState().setAccessToken(newAccessToken);
            if (newUser) useAuthStore.getState().updateUser(newUser);
            if (newRefreshToken) {
              useAuthStore.getState().setRefreshToken(newRefreshToken);
              await SecureStore.setItemAsync('aurea_refresh_token', newRefreshToken);
            }
            processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return authClient(originalRequest);
          }
          throw new Error('Refresh response missing accessToken');
        } catch (refreshError) {
          processQueue(refreshError, null);
          await useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(authClient(originalRequest));
          },
          reject,
        });
      });
    }

    return Promise.reject(error);
  }
);

export default authClient;
