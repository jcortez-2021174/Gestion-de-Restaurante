import { restaurantApi, ApiError } from '@/shared/apis/api';

/**
 * SERVICIO DE MESAS
 * 
 * Responsabilidad: CRUD + State Management de mesas
 * Endpoint base: http://localhost:3020/api/v1/mesas
 * 
 * Estados: DISPONIBLE ↔ RESERVADA/OCUPADA; RESERVADA ↔ DISPONIBLE/OCUPADA; OCUPADA → DISPONIBLE
 */

const MESAS_BASE = '/mesas';

/**
 * Obtener todas las mesas con filtros
 * @param {Object} filtros - Filtros opcionales (estado, capacidad)
 * @returns {Promise<{mesas}>}
 */
export const obtenerTodas = async (filtros = {}) => {
  try {
    const response = await restaurantApi.get(MESAS_BASE, { params: filtros });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'MESAS_FETCH_FAILED',
        message: 'Error al obtener mesas',
        userMessage: 'Error al cargar las mesas.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'MESAS_ERROR',
      message: error.message,
      userMessage: 'Error al cargar las mesas.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Obtener mesa por ID
 * @param {string} id - ID de la mesa
 * @returns {Promise<{mesa}>}
 */
export const obtenerPorId = async (id) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de mesa requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.get(`${MESAS_BASE}/${id}`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'MESA_NOT_FOUND',
        message: 'Mesa no encontrada',
        userMessage: 'La mesa no existe.',
        statusCode: 404,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'MESA_ERROR',
      message: error.message,
      userMessage: 'Error al cargar la mesa.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Obtener mesas disponibles
 * @param {number} capacidad - Capacidad mínima (opcional)
 * @param {string} fecha - Fecha en formato YYYY-MM-DD (opcional)
 * @param {string} hora - Hora en formato HH:MM (opcional)
 * @returns {Promise<{mesas}>}
 */
export const obtenerDisponibles = async (capacidad = null, fecha = null, hora = null) => {
  try {
    const params = { estado: 'DISPONIBLE' };
    if (capacidad) params.capacidad = capacidad;
    if (fecha) params.fecha = fecha;
    if (hora) params.hora = hora;

    const response = await restaurantApi.get(`${MESAS_BASE}/disponibles`, { params });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'AVAILABLE_MESAS_FAILED',
        message: 'Error al obtener mesas disponibles',
        userMessage: 'Error al cargar mesas disponibles.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'AVAILABLE_MESAS_ERROR',
      message: error.message,
      userMessage: 'Error al cargar mesas disponibles.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Obtener mesas por capacidad
 * @param {number} personas - Número de personas
 * @returns {Promise<{mesas}>}
 */
export const obtenerPorCapacidad = async (personas) => {
  try {
    if (!personas || personas < 1) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Capacidad inválida',
        userMessage: 'La capacidad debe ser mayor a 0.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.get(`${MESAS_BASE}/capacidad/${personas}`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'MESAS_BY_CAPACITY_FAILED',
        message: 'Error al obtener mesas por capacidad',
        userMessage: 'Error al cargar las mesas.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'MESAS_BY_CAPACITY_ERROR',
      message: error.message,
      userMessage: 'Error al cargar las mesas.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Crear nueva mesa (Admin only)
 * @param {Object} mesaData - Datos de la mesa
 * @returns {Promise<{mesa}>}
 */
export const crear = async (mesaData) => {
  try {
    const { numero, capacidad } = mesaData;

    if (!numero || !capacidad) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Campos requeridos faltantes',
        userMessage: 'Por favor completa los campos requeridos.',
        statusCode: 400,
      });
    }

    if (capacidad < 1) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Capacidad inválida',
        userMessage: 'La capacidad debe ser mayor a 0.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.post(MESAS_BASE, mesaData);

    if (response.status !== 201 && response.status !== 200) {
      throw new ApiError({
        code: 'MESA_CREATE_FAILED',
        message: response.data.message || 'Error al crear mesa',
        userMessage: 'Error al crear la mesa.',
        statusCode: response.status,
        details: response.data.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'MESA_CREATE_ERROR',
      message: error.message,
      userMessage: 'Error al crear la mesa.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Actualizar mesa (Admin only)
 * @param {string} id - ID de la mesa
 * @param {Object} mesaData - Datos a actualizar
 * @returns {Promise<{mesa}>}
 */
export const actualizar = async (id, mesaData) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de mesa requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.put(`${MESAS_BASE}/${id}`, mesaData);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'MESA_UPDATE_FAILED',
        message: response.data.message || 'Error al actualizar mesa',
        userMessage: 'Error al actualizar la mesa.',
        statusCode: response.status,
        details: response.data.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'MESA_UPDATE_ERROR',
      message: error.message,
      userMessage: 'Error al actualizar la mesa.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Eliminar mesa (Admin only)
 * @param {string} id - ID de la mesa
 * @returns {Promise<{message}>}
 */
export const eliminar = async (id) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de mesa requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.delete(`${MESAS_BASE}/${id}`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'MESA_DELETE_FAILED',
        message: response.data.message || 'Error al eliminar mesa',
        userMessage: 'Error al eliminar la mesa.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'MESA_DELETE_ERROR',
      message: error.message,
      userMessage: 'Error al eliminar la mesa.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Cambiar estado de la mesa
 * @param {string} id - ID de la mesa
 * @param {string} estado - Nuevo estado (DISPONIBLE, RESERVADA, OCUPADA)
 * @returns {Promise<{mesa}>}
 */
export const cambiarEstado = async (id, estado) => {
  try {
    if (!id || !estado) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID y estado requeridos',
        userMessage: 'Datos inválidos.',
        statusCode: 400,
      });
    }

    const estadosValidos = ['DISPONIBLE', 'RESERVADA', 'OCUPADA'];
    if (!estadosValidos.includes(estado)) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Estado inválido',
        userMessage: `El estado debe ser uno de: ${estadosValidos.join(', ')}`,
        statusCode: 400,
      });
    }

    const response = await restaurantApi.patch(`${MESAS_BASE}/${id}/estado`, {
      estado,
    });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'MESA_STATE_CHANGE_FAILED',
        message: response.data.message || 'Error al cambiar estado',
        userMessage: 'No se puede cambiar a ese estado desde el estado actual.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'MESA_STATE_ERROR',
      message: error.message,
      userMessage: 'Error al cambiar el estado de la mesa.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Ocupar mesa
 * @param {string} id - ID de la mesa
 * @param {string} pedidoId - ID del pedido (opcional)
 * @returns {Promise<{mesa}>}
 */
export const ocupar = async (id, pedidoId = null) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de mesa requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.patch(`${MESAS_BASE}/${id}/ocupar`, {
      pedidoId,
    });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'MESA_OCCUPY_FAILED',
        message: response.data.message || 'Error al ocupar mesa',
        userMessage: 'Error al ocupar la mesa.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'MESA_OCCUPY_ERROR',
      message: error.message,
      userMessage: 'Error al ocupar la mesa.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Liberar mesa
 * @param {string} id - ID de la mesa
 * @returns {Promise<{mesa}>}
 */
export const liberar = async (id) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de mesa requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.patch(`${MESAS_BASE}/${id}/liberar`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'MESA_RELEASE_FAILED',
        message: response.data.message || 'Error al liberar mesa',
        userMessage: 'Error al liberar la mesa.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'MESA_RELEASE_ERROR',
      message: error.message,
      userMessage: 'Error al liberar la mesa.',
      statusCode: error.response?.status || 500,
    });
  }
};

export default {
  obtenerTodas,
  obtenerPorId,
  obtenerDisponibles,
  obtenerPorCapacidad,
  crear,
  actualizar,
  eliminar,
  cambiarEstado,
  ocupar,
  liberar,
};
