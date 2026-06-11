import { restaurantApi } from "@/shared/apis/api";
import { cachedGet, invalidateRequestCache } from "@/shared/apis/request-cache";

const NOTIFICACIONES_BASE = "/notificaciones";

export const obtenerMisNotificaciones = async () => {
  const response = await cachedGet(restaurantApi, `${NOTIFICACIONES_BASE}/me`, {}, 5000);
  return response.data?.data || [];
};

export const obtenerNotificacionesAdmin = async () => {
  const response = await cachedGet(restaurantApi, `${NOTIFICACIONES_BASE}/admin`, {}, 5000);
  return {
    notificaciones: response.data?.data || [],
    noLeidas: response.data?.noLeidas || 0,
  };
};

export const marcarNotificacionAdminLeida = async (id) => {
  const response = await restaurantApi.patch(`${NOTIFICACIONES_BASE}/admin/${id}/leida`);
  invalidateRequestCache(`${NOTIFICACIONES_BASE}/admin`);
  return response.data?.data;
};

export const marcarTodasAdminLeidas = async () => {
  const response = await restaurantApi.patch(`${NOTIFICACIONES_BASE}/admin/leidas/todas`);
  invalidateRequestCache(`${NOTIFICACIONES_BASE}/admin`);
  return response.data;
};
