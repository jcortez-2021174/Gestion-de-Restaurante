// src/shared/api/restaurantClient.js
import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

const restaurantClient = axios.create({
  baseURL: ENDPOINTS.RESTAURANT,
  headers: {
    'Content-Type': 'application/json',
  },
});

restaurantClient.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default restaurantClient;
