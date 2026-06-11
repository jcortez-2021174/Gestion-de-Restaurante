import { restaurantApi, ApiError } from '@/shared/apis/api'

/**
 * SERVICIO DE CATEGORÍAS (alineado a categoria.controller.js)
 * Backend ruta: /AureaRestaurant/Admin/v1/categoria
 */

const CATEGORIA_BASE = '/categoria';

export const obtenerTodas = async () => {
  try {
    const response = await restaurantApi.get(`${CATEGORIA_BASE}`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'CATEGORIAS_FETCH_FAILED',
        message: response.data?.message || 'Error al obtener categorías',
        userMessage: 'Error al cargar las categorías.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'CATEGORIAS_ERROR',
      message: error.message,
      userMessage: 'Error al cargar las categorías.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const obtenerPorId = async (id) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de categoría requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.get(`${CATEGORIA_BASE}/${id}`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'CATEGORIA_NOT_FOUND',
        message: response.data?.message || 'Categoría no encontrada',
        userMessage: 'La categoría no existe.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'CATEGORIA_ERROR',
      message: error.message,
      userMessage: 'Error al cargar la categoría.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const crear = async (categoriaData) => {
  try {
    const { nombre } = categoriaData || {};

    if (!nombre || nombre.length < 3) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Nombre de categoría inválido',
        userMessage: 'El nombre debe tener al menos 3 caracteres.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.post(`${CATEGORIA_BASE}`, categoriaData);

    if (response.status !== 201 && response.status !== 200) {
      throw new ApiError({
        code: 'CATEGORIA_CREATE_FAILED',
        message: response.data?.message || 'Error al crear categoría',
        userMessage: 'Error al crear la categoría.',
        statusCode: response.status,
        details: response.data?.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'CATEGORIA_CREATE_ERROR',
      message: error.message,
      userMessage: 'Error al crear la categoría.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const actualizar = async (id, categoriaData) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de categoría requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.put(`${CATEGORIA_BASE}/${id}`, categoriaData);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'CATEGORIA_UPDATE_FAILED',
        message: response.data?.message || 'Error al actualizar categoría',
        userMessage: 'Error al actualizar la categoría.',
        statusCode: response.status,
        details: response.data?.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'CATEGORIA_UPDATE_ERROR',
      message: error.message,
      userMessage: 'Error al actualizar la categoría.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const eliminar = async (id) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de categoría requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.delete(`${CATEGORIA_BASE}/${id}`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'CATEGORIA_DELETE_FAILED',
        message: response.data?.message || 'Error al eliminar categoría',
        userMessage: 'Error al eliminar la categoría.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'CATEGORIA_DELETE_ERROR',
      message: error.message,
      userMessage: 'Error al eliminar la categoría.',
      statusCode: error.response?.status || 500,
    });
  }
};

export default {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
