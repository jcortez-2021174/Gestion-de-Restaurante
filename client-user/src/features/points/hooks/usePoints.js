// src/features/points/hooks/usePoints.js
import { useCallback, useEffect, useState } from 'react';
import restaurantClient from '../../../shared/api/restaurantClient';

export function usePoints() {
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPoints = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantClient.get('/puntos/me');
      const data = response.data?.data || response.data;
      setPoints(data || null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al cargar puntos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  return {
    points,
    loading,
    error,
    fetchPoints,
  };
}
