// src/features/orders/hooks/useOrders.js
import { useCallback, useEffect, useState } from 'react';
import restaurantClient from '../../../shared/api/restaurantClient';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantClient.get('/pedido');
      const data = response.data?.data || response.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantClient.post('/pedido', payload);
      const data = response.data?.data || response.data;
      setOrders((prev) => [data, ...prev]);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al crear el pedido');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
  };
}
