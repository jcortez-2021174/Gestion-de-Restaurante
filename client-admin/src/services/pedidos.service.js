import { restaurantApi, ApiError } from '@/shared/apis/api';
import { createOrderPayload, isMongoObjectId } from '@/features/user/order.contract';

const PEDIDOS_BASE = '/pedido';
export const ESTADOS_PEDIDO = [
  'Pendiente',
  'EnPreparacion',
  'Listo',
  'Entregado',
  'Cancelado',
];

const responseData = (response, fallbackMessage) => {
  if (response.status >= 200 && response.status < 300 && response.data?.success) {
    return response.data.data;
  }

  throw new ApiError({
    code: response.data?.code || 'ORDER_REQUEST_FAILED',
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
      code: 'ORDER_NETWORK_ERROR',
      message: error.message,
      userMessage: error.userMessage || fallbackMessage,
      statusCode: error.response?.status || 0,
    });
  }
};

export const obtenerTodos = async () => wrapRequest(
  () => restaurantApi.get(PEDIDOS_BASE),
  'No se pudieron cargar los pedidos.'
);

export const obtenerMisPedidos = async () => wrapRequest(
  () => restaurantApi.get(`${PEDIDOS_BASE}/mis-pedidos`),
  'No se pudo cargar tu historial de pedidos.'
);

export const crear = async (cartItems, mesaId = null) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new ApiError({
      code: 'EMPTY_CART',
      message: 'El carrito esta vacio',
      userMessage: 'Agrega al menos un producto antes de confirmar.',
      statusCode: 400,
    });
  }

  if (cartItems.some((item) => !isMongoObjectId(item?.id))) {
    throw new ApiError({
      code: 'INVALID_CART_PRODUCT',
      message: 'El carrito contiene productos que ya no pertenecen al catalogo',
      userMessage: 'Actualiza el carrito y agrega nuevamente los productos desde el menu.',
      statusCode: 400,
    });
  }

  return wrapRequest(
    () => restaurantApi.post(PEDIDOS_BASE, createOrderPayload(cartItems, mesaId)),
    'No se pudo crear el pedido.'
  );
};

export const cambiarEstado = async (id, estado) => {
  if (!ESTADOS_PEDIDO.includes(estado)) {
    throw new ApiError({
      code: 'INVALID_ORDER_STATUS',
      message: 'Estado invalido',
      userMessage: 'El estado seleccionado no es valido.',
      statusCode: 400,
    });
  }

  return wrapRequest(
    () => restaurantApi.patch(`${PEDIDOS_BASE}/${id}/estado`, { estado }),
    'No se pudo actualizar el estado.'
  );
};

export default {
  obtenerTodos,
  obtenerMisPedidos,
  crear,
  cambiarEstado,
};
