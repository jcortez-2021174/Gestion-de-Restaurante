// src/features/menu/hooks/useMenu.js
import { useCallback, useEffect, useState } from 'react';
import restaurantClient from '../../../shared/api/restaurantClient';

export function useMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantClient.get('/producto');
      const data = response.data?.data || response.data || [];
      const mapped = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id || item._id,
            nombre: item.nombre || item.name,
            descripcion: item.descripcion || item.description,
            precio: item.precio || item.price,
            imagen: item.imagen || item.image,
            categoria: item.categoria || item.category,
            disponible: Boolean(item.isActive ?? item.disponible ?? true),
          }))
        : [];
      setItems(mapped);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return {
    items,
    loading,
    error,
    fetchMenu,
  };
}
