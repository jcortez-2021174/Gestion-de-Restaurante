import { restaurantApi, ApiError } from '@/shared/apis/api'
import { cachedGet, invalidateRequestCache } from '@/shared/apis/request-cache';

/**
 * SERVICIO DE CLIENTES (alineado a cliente.routes.js / cliente.controller.js)
 * Backend Node monta rutas en: /AureaRestaurant/Admin/v1/cliente
 * Expuestos: POST /cliente, GET /cliente, PUT /cliente/:id, DELETE /cliente/:id, GET /cliente/dashboard
 */

const CLIENTE_BASE = '/cliente';

export const listarClientes = async () => {
  try {
    const response = await cachedGet(restaurantApi, CLIENTE_BASE);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'CLIENTES_FETCH_FAILED',
        message: response.data?.message || 'Error al obtener clientes',
        userMessage: 'Error al cargar los clientes.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'CLIENTES_ERROR',
      message: error.message,
      userMessage: 'Error al cargar los clientes.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const crearCliente = async (clienteData) => {
  try {
    const { nombre, apellido, telefono, correo, direccion } = clienteData || {};

    if (!nombre || !apellido || !telefono || !correo || !direccion) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Campos requeridos faltantes',
        userMessage: 'Por favor completa los campos requeridos.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.post(`${CLIENTE_BASE}`, { nombre, apellido, telefono, correo, direccion });
    invalidateRequestCache(CLIENTE_BASE);

    if (response.status !== 201 && response.status !== 200) {
      throw new ApiError({
        code: 'CLIENTE_CREATE_FAILED',
        message: response.data?.message || 'Error al crear cliente',
        userMessage: 'Error al crear el cliente.',
        statusCode: response.status,
        details: response.data?.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'CLIENTE_CREATE_ERROR',
      message: error.message,
      userMessage: 'Error al crear el cliente.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const editarCliente = async (id, clienteData) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de cliente requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.put(`${CLIENTE_BASE}/${id}`, clienteData);
    invalidateRequestCache(CLIENTE_BASE);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'CLIENTE_UPDATE_FAILED',
        message: response.data?.message || 'Error al actualizar cliente',
        userMessage: 'Error al actualizar el cliente.',
        statusCode: response.status,
        details: response.data?.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'CLIENTE_UPDATE_ERROR',
      message: error.message,
      userMessage: 'Error al actualizar el cliente.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const eliminarCliente = async (id) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de cliente requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.delete(`${CLIENTE_BASE}/${id}`);
    invalidateRequestCache(CLIENTE_BASE);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'CLIENTE_DELETE_FAILED',
        message: response.data?.message || 'Error al eliminar cliente',
        userMessage: 'Error al eliminar el cliente.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'CLIENTE_DELETE_ERROR',
      message: error.message,
      userMessage: 'Error al eliminar el cliente.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const obtenerDashboard = async () => {
  try {
    const response = await cachedGet(restaurantApi, `${CLIENTE_BASE}/dashboard`, {}, 3000);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'DASHBOARD_FETCH_FAILED',
        message: response.data?.message || 'Error al obtener dashboard',
        userMessage: 'Error al cargar el dashboard.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'DASHBOARD_ERROR',
      message: error.message,
      userMessage: 'Error al cargar el dashboard.',
      statusCode: error.response?.status || 500,
    });
  }
};

export default {
  listarClientes,
  crearCliente,
  editarCliente,
  eliminarCliente,
  obtenerDashboard,
};
