import { restaurantApi, ApiError } from "@/shared/apis/api";
import { cachedGet, invalidateRequestCache } from "@/shared/apis/request-cache";

const BASE = "/puntos";

const unwrap = (response, fallback) => {
  if (response.status >= 200 && response.status < 300 && response.data?.success) {
    return response.data.data;
  }
  throw new ApiError({
    code: response.data?.code || "LOYALTY_REQUEST_FAILED",
    message: response.data?.message || fallback,
    userMessage: response.data?.message || fallback,
    statusCode: response.status,
  });
};

export const obtenerMisPuntos = async () => unwrap(
  await cachedGet(restaurantApi, `${BASE}/me`, {}, 5000),
  "No se pudieron cargar tus Puntos Aurea."
);

export const canjearRecompensa = async (id) => {
  const data = unwrap(
    await restaurantApi.post(`${BASE}/recompensas/${id}/canjear`),
    "No se pudo canjear la recompensa."
  );
  invalidateRequestCache(BASE);
  return data;
};

export const listarRecompensasAdmin = async () => unwrap(
  await cachedGet(restaurantApi, `${BASE}/admin/recompensas`, {}, 3000),
  "No se pudieron cargar las recompensas."
);

export const crearRecompensa = async (payload) => {
  const data = unwrap(
    await restaurantApi.post(`${BASE}/admin/recompensas`, payload),
    "No se pudo crear la recompensa."
  );
  invalidateRequestCache(BASE);
  return data;
};

export const editarRecompensa = async (id, payload) => {
  const data = unwrap(
    await restaurantApi.put(`${BASE}/admin/recompensas/${id}`, payload),
    "No se pudo actualizar la recompensa."
  );
  invalidateRequestCache(BASE);
  return data;
};

export const eliminarRecompensa = async (id) => {
  const data = unwrap(
    await restaurantApi.delete(`${BASE}/admin/recompensas/${id}`),
    "No se pudo eliminar la recompensa."
  );
  invalidateRequestCache(BASE);
  return data;
};
