// src/features/auth/hooks/useAuth.js
import { useCallback, useState } from 'react';
import { useAuthStore } from '../../../shared/store/authStore';
import authClient from '../../../shared/api/authClient';

export function useAuth() {
  const { login, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = useCallback(async ({ username, password }) => {
    setLoading(true);
    setError('');
    try {
      const response = await authClient.post('/login', { username, password });
      const { accessToken, refreshToken, user } = response.data || {};
      if (!accessToken || !refreshToken || !user) {
        throw new Error('Respuesta inválida del servidor');
      }
      await login(accessToken, user, refreshToken);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const handleRegister = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      await authClient.post('/register', payload);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al registrar usuario');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    handleLogin,
    handleRegister,
    loading,
    error,
    logout,
  };
}
