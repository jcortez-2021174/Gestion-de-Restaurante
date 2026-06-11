import { restaurantApi, ApiError } from '@/shared/apis/api';
import { cachedGet, invalidateRequestCache } from '@/shared/apis/request-cache';

/**
 * SERVICIO DE PRODUCTOS (alineado a producto.routes.js / producto.controller.js)
 * Backend Node monta rutas en: /AureaRestaurant/Admin/v1/producto
 * Solo expone: POST /producto  y  GET /producto
 */

const PRODUCTO_BASE = '/producto';

export const listarProductos = async (filters = {}) => {
  try {
    const response = await cachedGet(
      restaurantApi,
      PRODUCTO_BASE,
      { params: filters },
      3000
    );

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
    const { nombre, precio, disponibilidad, idCategoria, descripcion, imagen } = productoData || {};

    if (!nombre || precio === undefined || !idCategoria) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Campos requeridos faltantes',
        userMessage: 'Por favor completa los campos requeridos.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.post(`${PRODUCTO_BASE}`, {
      nombre,
      precio,
      disponibilidad,
      idCategoria,
      descripcion,
      imagen,
    });
    invalidateRequestCache(PRODUCTO_BASE);

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

export const actualizarProducto = async (id, productoData) => {
  const response = await restaurantApi.put(`${PRODUCTO_BASE}/${id}`, productoData);
  invalidateRequestCache(PRODUCTO_BASE);
  if (response.status !== 200) {
    throw new ApiError({
      code: response.data?.code || 'PRODUCTO_UPDATE_FAILED',
      message: response.data?.message || 'Error al actualizar producto',
      userMessage: response.data?.message || 'Error al actualizar el producto.',
      statusCode: response.status,
      details: response.data?.errors,
    });
  }
  return response.data;
};

export const eliminarProducto = async (id) => {
  const response = await restaurantApi.delete(`${PRODUCTO_BASE}/${id}`);
  invalidateRequestCache(PRODUCTO_BASE);
  if (response.status !== 200) {
    throw new ApiError({
      code: response.data?.code || 'PRODUCTO_DELETE_FAILED',
      message: response.data?.message || 'Error al eliminar producto',
      userMessage: response.data?.message || 'Error al eliminar el producto.',
      statusCode: response.status,
    });
  }
  return response.data;
};

export default {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
