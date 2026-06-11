import { restaurantApi, ApiError } from '@/shared/apis/api';

const CONFIG_PATH = '/restaurante/configuracion';

const unwrap = (response, fallback) => {
  if (response.status >= 200 && response.status < 300 && response.data?.success) {
    return response.data.data;
  }
  throw new ApiError({
    code: response.data?.code || 'RESTAURANT_CONFIG_ERROR',
    message: response.data?.message || fallback,
    userMessage: response.data?.message || fallback,
    statusCode: response.status,
  });
};

export const obtenerConfiguracion = async () => unwrap(
  await restaurantApi.get(CONFIG_PATH),
  'No se pudo cargar la configuracion.'
);

export const guardarConfiguracion = async (data) => unwrap(
  await restaurantApi.put(CONFIG_PATH, data),
  'No se pudo guardar la configuracion.'
);

export default { obtenerConfiguracion, guardarConfiguracion };
