// src/shared/constants/endpoints.js
const AUTH_URL = process.env.EXPO_PUBLIC_AUTH_URL || 'http://localhost:5022/api/v1/auth';
const RESTAURANT_URL = process.env.EXPO_PUBLIC_RESTAURANT_URL || 'http://localhost:3020/AureaRestaurant/Admin/v1';

export const ENDPOINTS = {
  AUTH: AUTH_URL,
  RESTAURANT: RESTAURANT_URL,
};
