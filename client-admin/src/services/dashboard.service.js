import { restaurantApi, ApiError } from '../shared/apis/api';
import { cachedGet } from '../shared/apis/request-cache';

const DASHBOARD_BASE = '/dashboard';

const requestData = async (path, params, fallback) => {
    try {
        const response = await cachedGet(
            restaurantApi,
            path,
            { params },
            path.endsWith('/stats') ? 10000 : 3000
        );
        if (response.status !== 200) {
            throw new ApiError({
                code: response.data?.code || 'DASHBOARD_REQUEST_FAILED',
                message: response.data?.message || fallback,
                userMessage: response.data?.message || fallback,
                statusCode: response.status,
            });
        }
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError({
            code: 'DASHBOARD_NETWORK_ERROR',
            message: error.message,
            userMessage: fallback,
            statusCode: error.response?.status || 0,
        });
    }
};

export const obtenerEstadisticas = async () => {
    const data = await requestData(
        `${DASHBOARD_BASE}/stats`,
        {},
        'Error al cargar las estadisticas.'
    );
    return data.stats || data;
};

export const obtenerReportes = async (filtros = {}) => {
    const data = await requestData(
        `${DASHBOARD_BASE}/reports`,
        filtros,
        'Error al cargar los reportes.'
    );
    return data.data;
};

export default {
    obtenerEstadisticas,
    obtenerReportes,
};
