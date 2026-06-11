import { restaurantApi, ApiError } from '@/shared/apis/api';

/**
 * SERVICIO DE PEDIDOS
 * 
 * Responsabilidad: CRUD + Workflow de pedidos
 * Endpoint base: http://localhost:3020/api/v1/pedidos
 * 
 * Estados: Pendiente → EnPreparacion/Cancelado → Listo/Cancelado → Entregado/Cancelado
 */

const PEDIDOS_BASE = '/pedido';

/**
 * Obtener todos los pedidos con paginación y filtros
 * @param {Object} filtros - Filtros opcionales
 * @param {number} page - Número de página (default 1)
 * @param {number} limit - Cantidad por página (default 20)
 * @returns {Promise<{pedidos, total, pages, currentPage}>}
 */
export const obtenerTodos = async (filtros = {}, page = 1, limit = 20) => {
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
    const response = await restaurantApi.get(PEDIDOS_BASE, { params });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'PEDIDOS_FETCH_FAILED',
        message: 'Error al obtener pedidos',
        userMessage: 'Error al cargar los pedidos.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PEDIDOS_ERROR',
      message: error.message,
      userMessage: 'Error al cargar los pedidos.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Obtener pedido por ID
 * @param {string} id - ID del pedido
 * @returns {Promise<{pedido}>}
 */
export const obtenerPorId = async (id) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de pedido requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.get(`${PEDIDOS_BASE}/${id}`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'PEDIDO_NOT_FOUND',
        message: 'Pedido no encontrado',
        userMessage: 'El pedido no existe.',
        statusCode: 404,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PEDIDO_ERROR',
      message: error.message,
      userMessage: 'Error al cargar el pedido.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Obtener pedidos de un cliente
 * @param {string} clienteId - ID del cliente
 * @param {number} page - Número de página (default 1)
 * @param {number} limit - Cantidad por página (default 20)
 * @returns {Promise<{pedidos, total, pages, currentPage}>}
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

    const response = await restaurantApi.get(`${PEDIDOS_BASE}/cliente/${clienteId}`, {
      params: { page, limit },
    });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'PEDIDOS_BY_CLIENT_FAILED',
        message: 'Error al obtener pedidos del cliente',
        userMessage: 'Error al cargar los pedidos.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PEDIDOS_BY_CLIENT_ERROR',
      message: error.message,
      userMessage: 'Error al cargar los pedidos.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Obtener pedidos por estado
 * @param {string} estado - Estado del pedido (Pendiente, EnPreparacion, Listo, Entregado, Cancelado)
 * @param {number} page - Número de página (default 1)
 * @param {number} limit - Cantidad por página (default 20)
 * @returns {Promise<{pedidos, total, pages, currentPage}>}
 */
export const obtenerPorEstado = async (estado, page = 1, limit = 20) => {
  try {
    if (!estado) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Estado requerido',
        userMessage: 'Estado inválido.',
        statusCode: 400,
      });
    }

    const estadosValidos = ['Pendiente', 'EnPreparacion', 'Listo', 'Entregado', 'Cancelado'];
    if (!estadosValidos.includes(estado)) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Estado inválido',
        userMessage: `El estado debe ser uno de: ${estadosValidos.join(', ')}`,
        statusCode: 400,
      });
    }

    const response = await restaurantApi.get(`${PEDIDOS_BASE}/estado/${estado}`, {
      params: { page, limit },
    });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'PEDIDOS_BY_STATE_FAILED',
        message: 'Error al obtener pedidos por estado',
        userMessage: 'Error al cargar los pedidos.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PEDIDOS_BY_STATE_ERROR',
      message: error.message,
      userMessage: 'Error al cargar los pedidos.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Crear nuevo pedido
 * @param {Object} pedidoData - Datos del pedido
 * @returns {Promise<{pedido}>}
 */
export const crear = async (pedidoData) => {
  try {
    const { clienteId, items, total } = pedidoData;

    if (!clienteId || !items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Datos de pedido inválidos',
        userMessage: 'El pedido debe contener al menos un producto.',
        statusCode: 400,
      });
    }

    if (!total || total <= 0) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Total del pedido inválido',
        userMessage: 'El total debe ser mayor a 0.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.post(PEDIDOS_BASE, pedidoData);

    if (response.status !== 201 && response.status !== 200) {
      throw new ApiError({
        code: 'PEDIDO_CREATE_FAILED',
        message: response.data.message || 'Error al crear pedido',
        userMessage: 'Error al crear el pedido.',
        statusCode: response.status,
        details: response.data.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PEDIDO_CREATE_ERROR',
      message: error.message,
      userMessage: 'Error al crear el pedido.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Actualizar pedido
 * @param {string} id - ID del pedido
 * @param {Object} pedidoData - Datos a actualizar
 * @returns {Promise<{pedido}>}
 */
export const actualizar = async (id, pedidoData) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de pedido requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.put(`${PEDIDOS_BASE}/${id}`, pedidoData);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'PEDIDO_UPDATE_FAILED',
        message: response.data.message || 'Error al actualizar pedido',
        userMessage: 'Error al actualizar el pedido.',
        statusCode: response.status,
        details: response.data.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PEDIDO_UPDATE_ERROR',
      message: error.message,
      userMessage: 'Error al actualizar el pedido.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Eliminar pedido
 * @param {string} id - ID del pedido
 * @returns {Promise<{message}>}
 */
export const eliminar = async (id) => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de pedido requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.delete(`${PEDIDOS_BASE}/${id}`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'PEDIDO_DELETE_FAILED',
        message: response.data.message || 'Error al eliminar pedido',
        userMessage: 'Error al eliminar el pedido.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PEDIDO_DELETE_ERROR',
      message: error.message,
      userMessage: 'Error al eliminar el pedido.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Cambiar estado del pedido (Workflow)
 * @param {string} id - ID del pedido
 * @param {string} estado - Nuevo estado (Pendiente, EnPreparacion, Listo, Entregado, Cancelado)
 * @returns {Promise<{pedido}>}
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

    const estadosValidos = ['Pendiente', 'EnPreparacion', 'Listo', 'Entregado', 'Cancelado'];
    if (!estadosValidos.includes(estado)) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Estado inválido',
        userMessage: `El estado debe ser uno de: ${estadosValidos.join(', ')}`,
        statusCode: 400,
      });
    }

    const response = await restaurantApi.patch(`${PEDIDOS_BASE}/${id}/estado`, {
      estado,
    });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'PEDIDO_STATE_CHANGE_FAILED',
        message: response.data.message || 'Transición de estado no permitida',
        userMessage: response.data.message || 'No se puede cambiar a ese estado desde el estado actual.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PEDIDO_STATE_ERROR',
      message: error.message,
      userMessage: 'Error al cambiar el estado del pedido.',
      statusCode: error.response?.status || 500,
    });
  }
};

/**
 * Cancelar pedido
 * @param {string} id - ID del pedido
 * @param {string} razon - Razón de la cancelación (opcional)
 * @returns {Promise<{pedido}>}
 */
export const cancelar = async (id, razon = '') => {
  try {
    if (!id) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'ID de pedido requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await restaurantApi.patch(`${PEDIDOS_BASE}/${id}/cancelar`, {
      razon,
    });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'PEDIDO_CANCEL_FAILED',
        message: response.data.message || 'Error al cancelar pedido',
        userMessage: 'Error al cancelar el pedido.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PEDIDO_CANCEL_ERROR',
      message: error.message,
      userMessage: 'Error al cancelar el pedido.',
      statusCode: error.response?.status || 500,
    });
  }
};

export default {
  obtenerTodos,
  obtenerPorId,
  obtenerPorCliente,
  obtenerPorEstado,
  crear,
  actualizar,
  eliminar,
  cambiarEstado,
  cancelar,
};
