import { restaurantApi, ApiError } from '@/shared/apis/api';
import { cachedGet, invalidateRequestCache } from '@/shared/apis/request-cache';

/**
 * SERVICIO DE RESERVACIONES
 * 
 * Responsabilidad: CRUD + Workflow de reservaciones
 * Endpoint base: http://localhost:3020/api/v1/reservaciones
 * 
 * Estados: PENDIENTE -> CONFIRMADA -> COMPLETADA, o CANCELADA
 */

const RESERVACIONES_BASE = '/reservacion';

/**
 * Obtener todas las reservaciones con paginación y filtros
 * @param {Object} filtros - Filtros opcionales
 * @param {number} page - Número de página (default 1)
 * @param {number} limit - Cantidad por página (default 20)
 * @returns {Promise<{reservaciones, total, pages, currentPage}>}
 */
export const obtenerTodas = async (filtros = {}, page = 1, limit = 20) => {
  try {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Parámetros de paginación inválidos',
        userMessage: 'Parámetros inválidos. Intenta de nuevo.',
        statusCode: 400,
      });
    }

    const params = { page, limit, ...filtros };
    const response = await cachedGet(
      restaurantApi,
      RESERVACIONES_BASE,
      { params },
      2000
    );

    if (response.status !== 200) {
      throw new ApiError({
        code: 'RESERVACIONES_FETCH_FAILED',
        message: 'Error al obtener reservaciones',
        userMessage: 'Error al cargar las reservaciones.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'RESERVACIONES_ERROR',
      message: error.message,
      userMessage: 'Error al cargar las reservaciones.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Obtener reservación por ID
 * @param {string} id - ID de la reservación
 * @returns {Promise<{reservacion}>}
 */
export const obtenerPorId = async (id) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de reservación requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.get(`${RESERVACIONES_BASE}/${id}`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'RESERVACION_NOT_FOUND',
        message: 'Reservación no encontrada',
        userMessage: 'La reservación no existe.',
        statusCode: 404,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'RESERVACION_ERROR',
      message: error.message,
      userMessage: 'Error al cargar la reservación.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Obtener reservaciones de un cliente
 * @param {string} clienteId - ID del cliente
 * @param {number} page - Número de página (default 1)
 * @param {number} limit - Cantidad por página (default 20)
 * @returns {Promise<{reservaciones, total, pages, currentPage}>}
 */
export const obtenerPorCliente = async (clienteId, page = 1, limit = 20) => {
  try {
    if (!clienteId) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de cliente requerido',
        userMessage: 'Cliente inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.get(`${RESERVACIONES_BASE}/cliente/${clienteId}`, {
      params: { page, limit },
    });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'RESERVACIONES_BY_CLIENT_FAILED',
        message: 'Error al obtener reservaciones del cliente',
        userMessage: 'Error al cargar las reservaciones.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'RESERVACIONES_BY_CLIENT_ERROR',
      message: error.message,
      userMessage: 'Error al cargar las reservaciones.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Obtener reservaciones de una mesa
 * @param {string} mesaId - ID de la mesa
 * @param {string} fecha - Fecha en formato YYYY-MM-DD (opcional)
 * @returns {Promise<{reservaciones}>}
 */
export const obtenerPorMesa = async (mesaId, fecha = null) => {
  try {
    if (!mesaId) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de mesa requerido',
        userMessage: 'Mesa inválida.',
        statusCode: 400,
      });
    }

    const params = {};
    if (fecha) params.fecha = fecha;

    const response = await restaurantApi.get(`${RESERVACIONES_BASE}/mesa/${mesaId}`, {
      params,
    });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'RESERVACIONES_BY_TABLE_FAILED',
        message: 'Error al obtener reservaciones de la mesa',
        userMessage: 'Error al cargar las reservaciones.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'RESERVACIONES_BY_TABLE_ERROR',
      message: error.message,
      userMessage: 'Error al cargar las reservaciones.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Crear nueva reservación
 * @param {Object} reservacionData - Datos de la reservación
 * @returns {Promise<{reservacion}>}
 */
export const crear = async (reservacionData) => {
  try {
    const { clienteId, mesaId, fecha, horaInicio, horaFin, personas } = reservacionData;

    if (!clienteId || !mesaId || !fecha || !horaInicio || !horaFin || !personas) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Campos requeridos faltantes',
        userMessage: 'Por favor completa todos los campos.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.post(RESERVACIONES_BASE, {
      clienteId,
      mesaId,
      fecha,
      horaInicio,
      horaFin,
      personas: Number(personas),
      estado: reservacionData.estado,
    });
    invalidateRequestCache(RESERVACIONES_BASE, '/mesas', '/dashboard');

    if (response.status !== 201 && response.status !== 200) {
      throw new ApiError({
        code: 'RESERVACION_CREATE_FAILED',
        message: response.data.message || 'Error al crear reservación',
        userMessage: 'Error al crear la reservación.',
        statusCode: response.status,
        details: response.data.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'RESERVACION_CREATE_ERROR',
      message: error.message,
      userMessage: 'Error al crear la reservación.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Actualizar reservación
 * @param {string} id - ID de la reservación
 * @param {Object} reservacionData - Datos a actualizar
 * @returns {Promise<{reservacion}>}
 */
export const actualizar = async (id, reservacionData) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de reservación requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.put(`${RESERVACIONES_BASE}/${id}`, reservacionData);
    invalidateRequestCache(RESERVACIONES_BASE, '/mesas', '/dashboard');

    if (response.status !== 200) {
      throw new ApiError({
        code: 'RESERVACION_UPDATE_FAILED',
        message: response.data.message || 'Error al actualizar reservación',
        userMessage: 'Error al actualizar la reservación.',
        statusCode: response.status,
        details: response.data.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'RESERVACION_UPDATE_ERROR',
      message: error.message,
      userMessage: 'Error al actualizar la reservación.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Eliminar reservación
 * @param {string} id - ID de la reservación
 * @returns {Promise<{message}>}
 */
export const eliminar = async (id) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de reservación requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.delete(`${RESERVACIONES_BASE}/${id}`);
    invalidateRequestCache(RESERVACIONES_BASE, '/mesas', '/dashboard');

    if (response.status !== 200) {
      throw new ApiError({
        code: 'RESERVACION_DELETE_FAILED',
        message: response.data.message || 'Error al eliminar reservación',
        userMessage: 'Error al eliminar la reservación.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'RESERVACION_DELETE_ERROR',
      message: error.message,
      userMessage: 'Error al eliminar la reservación.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Cambiar estado de la reservación
 * @param {string} id - ID de la reservación
 * @param {string} estado - Nuevo estado (RESERVADA, CANCELADA, EXPIRADA)
 * @returns {Promise<{reservacion}>}
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

    const estadosValidos = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'];
    if (!estadosValidos.includes(estado)) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Estado inválido',
        userMessage: `El estado debe ser uno de: ${estadosValidos.join(', ')}`,
        statusCode: 400,
      });
    }

    const response = await restaurantApi.patch(`${RESERVACIONES_BASE}/${id}/estado`, {
      estado,
    });
    invalidateRequestCache(RESERVACIONES_BASE, '/mesas', '/dashboard');

    if (response.status !== 200) {
      throw new ApiError({
        code: 'RESERVACION_STATE_CHANGE_FAILED',
        message: response.data.message || 'Error al cambiar estado',
        userMessage: 'No se puede cambiar a ese estado desde el estado actual.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'RESERVACION_STATE_ERROR',
      message: error.message,
      userMessage: 'Error al cambiar el estado de la reservación.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const obtenerMisReservaciones = async () => {
  const response = await cachedGet(
    restaurantApi,
    `${RESERVACIONES_BASE}/mis-reservaciones`,
    {},
    2000
  );
  if (response.status !== 200) {
    throw new ApiError({
      code: response.data?.code || 'MY_RESERVATIONS_FAILED',
      message: response.data?.message || 'No se pudieron cargar tus reservaciones',
      userMessage: response.data?.message || 'No se pudieron cargar tus reservaciones.',
      statusCode: response.status,
    });
  }
  return response.data.data || [];
};

export const crearMiReservacion = async (data) => {
  const response = await restaurantApi.post(`${RESERVACIONES_BASE}/mis-reservaciones`, {
    mesaId: data.mesaId,
    fecha: data.fecha,
    horaInicio: data.horaInicio,
    horaFin: data.horaFin,
    personas: Number(data.personas),
    notas: data.notas || '',
  });
  invalidateRequestCache(RESERVACIONES_BASE, '/mesas', '/dashboard');
  if (response.status !== 201) {
    throw new ApiError({
      code: response.data?.code || 'MY_RESERVATION_CREATE_FAILED',
      message: response.data?.message || 'No se pudo crear la reservacion',
      userMessage: response.data?.message || 'No se pudo crear la reservacion.',
      statusCode: response.status,
      details: response.data?.errors,
    });
  }
  return response.data.data;
};

export const cancelarMiReservacion = async (id, razon = '') => {
  const response = await restaurantApi.patch(
    `${RESERVACIONES_BASE}/mis-reservaciones/${id}/cancelar`,
    { razon }
  );
  invalidateRequestCache(RESERVACIONES_BASE, '/mesas', '/dashboard');
  if (response.status !== 200) {
    throw new ApiError({
      code: response.data?.code || 'MY_RESERVATION_CANCEL_FAILED',
      message: response.data?.message || 'No se pudo cancelar la reservacion',
      userMessage: response.data?.message || 'No se pudo cancelar la reservacion.',
      statusCode: response.status,
    });
  }
  return response.data.data;
};

/**
 * Cancelar reservación
 * @param {string} id - ID de la reservación
 * @param {string} razon - Razón de la cancelación (opcional)
 * @returns {Promise<{reservacion}>}
 */
export const cancelar = async (id, razon = '') => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de reservación requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.patch(`${RESERVACIONES_BASE}/${id}/cancelar`, {
      razon,
    });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'RESERVACION_CANCEL_FAILED',
        message: response.data.message || 'Error al cancelar reservación',
        userMessage: 'Error al cancelar la reservación.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'RESERVACION_CANCEL_ERROR',
      message: error.message,
      userMessage: 'Error al cancelar la reservación.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Verificar disponibilidad de mesa para una fecha y rango horario
 * @param {string} mesaId - ID de la mesa
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} horaInicio - Hora inicio en formato HH:MM
 * @param {string} horaFin - Hora fin en formato HH:MM
 * @returns {Promise<{disponible: boolean, motivo?: string}>}
 */
export const verificarDisponibilidad = async (mesaId, fecha, horaInicio, horaFin) => {
  try {
    if (!mesaId || !fecha || !horaInicio || !horaFin) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Parámetros requeridos faltantes',
        userMessage: 'Por favor proporciona todos los datos.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.get(`${RESERVACIONES_BASE}/disponibilidad/verificar`, {
      params: { mesaId, fecha, horaInicio, horaFin },
    });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'AVAILABILITY_CHECK_FAILED',
        message: 'Error al verificar disponibilidad',
        userMessage: 'Error al verificar disponibilidad.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'AVAILABILITY_CHECK_ERROR',
      message: error.message,
      userMessage: 'Error al verificar disponibilidad.',
      statusCode: error.response?.status || 500,
    });
  }
};

export default {
  obtenerTodas,
  obtenerPorId,
  obtenerPorCliente,
  obtenerPorMesa,
  crear,
  actualizar,
  eliminar,
  cambiarEstado,
  cancelar,
  verificarDisponibilidad,
};
