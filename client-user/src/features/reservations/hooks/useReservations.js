// src/features/reservations/hooks/useReservations.js
import { useCallback, useEffect, useState } from 'react';
import restaurantClient from '../../../shared/api/restaurantClient';

export function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantClient.get('/reservacion/mis-reservaciones');
      const data = response.data?.data || response.data || [];
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReservation = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantClient.post('/reservacion/mis-reservaciones', payload);
      const data = response.data?.data || response.data;
      setReservations((prev) => [data, ...prev]);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al crear la reserva');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelReservation = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      await restaurantClient.patch(`/reservacion/mis-reservaciones/${id}/cancelar`);
      setReservations((prev) =>
        prev.map((item) =>
          item.id === id || item._id === id ? { ...item, estado: 'cancelada' } : item
        )
      );
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al cancelar la reserva');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    fetchReservations,
    createReservation,
    cancelReservation,
  };
}
