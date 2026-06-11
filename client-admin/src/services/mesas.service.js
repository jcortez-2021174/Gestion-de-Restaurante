import { restaurantApi, ApiError } from '@/shared/apis/api';

const MESAS_BASE = '/mesas';
const ESTADOS_MESA = ['DISPONIBLE', 'RESERVADA', 'OCUPADA'];

const responseData = (response, fallbackMessage) => {
  if (response.status >= 200 && response.status < 300 && response.data?.success) {
    return response.data.data;
  }

  throw new ApiError({
    code: response.data?.code || 'TABLE_REQUEST_FAILED',
    message: response.data?.message || fallbackMessage,
    userMessage: response.data?.message || fallbackMessage,
    statusCode: response.status,
    details: response.data?.errors,
  });
};

const wrapRequest = async (request, fallbackMessage) => {
  try {
    return responseData(await request(), fallbackMessage);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'TABLE_NETWORK_ERROR',
      message: error.message,
      userMessage: error.userMessage || fallbackMessage,
      statusCode: error.response?.status || 0,
    });
  }
};

const validateMesa = ({ numero, capacidad, estado = 'DISPONIBLE' }) => {
  if (!Number.isInteger(Number(numero)) || Number(numero) < 1) {
    throw new ApiError({
      code: 'INVALID_TABLE_NUMBER',
      message: 'numero invalido',
      userMessage: 'El numero de mesa debe ser mayor a 0.',
      statusCode: 400,
    });
  }

  if (!Number.isInteger(Number(capacidad)) || Number(capacidad) < 1) {
    throw new ApiError({
      code: 'INVALID_TABLE_CAPACITY',
      message: 'capacidad invalida',
      userMessage: 'La capacidad debe ser mayor a 0.',
      statusCode: 400,
    });
  }

  if (!ESTADOS_MESA.includes(estado)) {
    throw new ApiError({
      code: 'INVALID_TABLE_STATUS',
      message: 'estado invalido',
      userMessage: 'El estado de mesa no es valido.',
      statusCode: 400,
    });
  }
};

const mesaPayload = (mesaData) => {
  validateMesa(mesaData);

  return {
    numero: Number(mesaData.numero),
    capacidad: Number(mesaData.capacidad),
    estado: mesaData.estado || 'DISPONIBLE',
  };
};

export const obtenerTodas = async (filtros = {}) => wrapRequest(
  () => restaurantApi.get(MESAS_BASE, { params: filtros }),
  'No se pudieron cargar las mesas.'
);

export const obtenerPorId = async (id) => wrapRequest(
  () => restaurantApi.get(`${MESAS_BASE}/${id}`),
  'No se pudo cargar la mesa.'
);

export const crear = async (mesaData) => wrapRequest(
  () => restaurantApi.post(MESAS_BASE, mesaPayload(mesaData)),
  'No se pudo crear la mesa.'
);

export const actualizar = async (id, mesaData) => wrapRequest(
  () => restaurantApi.put(`${MESAS_BASE}/${id}`, mesaPayload(mesaData)),
  'No se pudo actualizar la mesa.'
);

export const eliminar = async (id) => wrapRequest(
  () => restaurantApi.delete(`${MESAS_BASE}/${id}`),
  'No se pudo eliminar la mesa.'
);

export default {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
