import { restaurantApi, ApiError } from '@/shared/apis/api';

/**
 * SERVICIO DE PRODUCTOS (alineado a producto.routes.js / producto.controller.js)
 * Backend Node monta rutas en: /AureaRestaurant/Admin/v1/producto
 * Solo expone: POST /producto  y  GET /producto
 */

const PRODUCTO_FULL_BASE = (import.meta.env.VITE_RESTAURANT_FULL_BASE || 'http://localhost:3020') + '/AureaRestaurant/Admin/v1/producto';

export const listarProductos = async () => {
  try {
    // Llamada absoluta para evitar mismatch con restaurantApi.baseURL
    const response = await restaurantApi.get(`${PRODUCTO_FULL_BASE}`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'PRODUCTOS_FETCH_FAILED',
        message: response.data?.message || 'Error al obtener productos',
        userMessage: 'Error al cargar los productos.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PRODUCTOS_ERROR',
      message: error.message,
      userMessage: 'Error al cargar los productos.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const crearProducto = async (productoData) => {
  try {
    const { nombre, precio, disponibilidad, idCategoria } = productoData || {};

    if (!nombre || precio === undefined || !idCategoria) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Campos requeridos faltantes',
        userMessage: 'Por favor completa los campos requeridos.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.post(`${PRODUCTO_FULL_BASE}`, { nombre, precio, disponibilidad, idCategoria });

    if (response.status !== 201 && response.status !== 200) {
      throw new ApiError({
        code: 'PRODUCTO_CREATE_FAILED',
        message: response.data?.message || 'Error al crear producto',
        userMessage: 'Error al crear el producto.',
        statusCode: response.status,
        details: response.data?.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PRODUCTO_CREATE_ERROR',
      message: error.message,
      userMessage: 'Error al crear el producto.',
      statusCode: error.response?.status || 500,
    });
  }
};

export default {
  listarProductos,
  crearProducto,
};
