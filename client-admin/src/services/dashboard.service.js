import { restaurantApi, ApiError } from '@/shared/apis/api';

const DASHBOARD_BASE = '/dashboard';

export const obtenerEstadisticas = async (rango = '30d') => {
    try {
        const response = await restaurantApi.get(`${DASHBOARD_BASE}/estadisticas`, { params: { rango } });
        if (response.status !== 200) {
            throw new ApiError({
                code: 'STATISTICS_FETCH_FAILED',
                message: 'Error al obtener estadísticas',
                userMessage: 'Error al cargar las estadísticas.',
                statusCode: response.status,
            });
        }
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError({
            code: 'STATISTICS_ERROR',
            message: error.message,
            userMessage: 'Error al cargar las estadísticas.',
            statusCode: error.response?.status || 500,
        });
    }
};

export const obtenerVentas = async (filtros = {}) => {
    try {
        const response = await restaurantApi.get(`${DASHBOARD_BASE}/ventas`, { params: filtros });
        if (response.status !== 200) {
            throw new ApiError({
                code: 'SALES_FETCH_FAILED',
                message: 'Error al obtener ventas',
                userMessage: 'Error al cargar las ventas.',
                statusCode: response.status,
            });
        }
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError({
            code: 'SALES_ERROR',
            message: error.message,
            userMessage: 'Error al cargar las ventas.',
            statusCode: error.response?.status || 500,
        });
    }
};

export const obtenerProductosMasVendidos = async (limite = 10, rango = '30d') => {
    try {
        const response = await restaurantApi.get(`${DASHBOARD_BASE}/productos-vendidos`, {
            params: { limite, rango },
        });
        if (response.status !== 200) {
            throw new ApiError({
                code: 'TOP_PRODUCTS_FETCH_FAILED',
                message: 'Error al obtener productos',
                userMessage: 'Error al cargar los productos.',
                statusCode: response.status,
            });
        }
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError({
            code: 'TOP_PRODUCTS_ERROR',
            message: error.message,
            userMessage: 'Error al cargar los productos.',
            statusCode: error.response?.status || 500,
        });
    }
};

export const obtenerOrdenesPorEstado = async () => {
    try {
        const response = await restaurantApi.get(`${DASHBOARD_BASE}/ordenes-estado`);
        if (response.status !== 200) {
            throw new ApiError({
                code: 'ORDERS_BY_STATE_FAILED',
                message: 'Error al obtener órdenes',
                userMessage: 'Error al cargar las órdenes.',
                statusCode: response.status,
            });
        }
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError({
            code: 'ORDERS_BY_STATE_ERROR',
            message: error.message,
            userMessage: 'Error al cargar las órdenes.',
            statusCode: error.response?.status || 500,
        });
    }
};

export const obtenerClientesFrecuentes = async (limite = 10) => {
    try {
        const response = await restaurantApi.get(`${DASHBOARD_BASE}/clientes-frecuentes`, {
            params: { limite },
        });
        if (response.status !== 200) {
            throw new ApiError({
                code: 'TOP_CLIENTS_FETCH_FAILED',
                message: 'Error al obtener clientes',
                userMessage: 'Error al cargar los clientes.',
                statusCode: response.status,
            });
        }
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError({
            code: 'TOP_CLIENTS_ERROR',
            message: error.message,
            userMessage: 'Error al cargar los clientes.',
            statusCode: error.response?.status || 500,
        });
    }
};

export const obtenerGraficoIngresos = async (periodo = 'mes') => {
    try {
        const response = await restaurantApi.get(`${DASHBOARD_BASE}/grafico-ingresos`, {
            params: { periodo },
        });
        if (response.status !== 200) {
            throw new ApiError({
                code: 'REVENUE_CHART_FAILED',
                message: 'Error al obtener gráfico',
                userMessage: 'Error al cargar el gráfico.',
                statusCode: response.status,
            });
        }
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError({
            code: 'REVENUE_CHART_ERROR',
            message: error.message,
            userMessage: 'Error al cargar el gráfico.',
            statusCode: error.response?.status || 500,
        });
    }
};

export const obtenerOcupacionMesas = async () => {
    try {
        const response = await restaurantApi.get(`${DASHBOARD_BASE}/ocupacion-mesas`);
        if (response.status !== 200) {
            throw new ApiError({
                code: 'TABLE_OCCUPANCY_FAILED',
                message: 'Error al obtener ocupación',
                userMessage: 'Error al cargar la ocupación.',
                statusCode: response.status,
            });
        }
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError({
            code: 'TABLE_OCCUPANCY_ERROR',
            message: error.message,
            userMessage: 'Error al cargar la ocupación.',
            statusCode: error.response?.status || 500,
        });
    }
};

export const obtenerReservasPorFecha = async (fecha) => {
    try {
        const response = await restaurantApi.get(`${DASHBOARD_BASE}/reservas-fecha`, {
            params: { fecha },
        });
        if (response.status !== 200) {
            throw new ApiError({
                code: 'RESERVATIONS_BY_DATE_FAILED',
                message: 'Error al obtener reservaciones',
                userMessage: 'Error al cargar las reservaciones.',
                statusCode: response.status,
            });
        }
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError({
            code: 'RESERVATIONS_BY_DATE_ERROR',
            message: error.message,
            userMessage: 'Error al cargar las reservaciones.',
            statusCode: error.response?.status || 500,
        });
    }
};

export const exportarReporte = async (tipo, formato, filtros = {}) => {
    try {
        const response = await restaurantApi.get(`${DASHBOARD_BASE}/exportar-reporte`, {
            params: { tipo, formato, ...filtros },
            responseType: 'blob',
        });
        if (response.status !== 200) {
            throw new ApiError({
                code: 'EXPORT_FAILED',
                message: 'Error al exportar',
                userMessage: 'Error al exportar el reporte.',
                statusCode: response.status,
            });
        }
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError({
            code: 'EXPORT_ERROR',
            message: error.message,
            userMessage: 'Error al exportar el reporte.',
            statusCode: error.response?.status || 500,
        });
    }
};

export default {
    obtenerEstadisticas,
    obtenerVentas,
    obtenerProductosMasVendidos,
    obtenerOrdenesPorEstado,
    obtenerClientesFrecuentes,
    obtenerGraficoIngresos,
    obtenerOcupacionMesas,
    obtenerReservasPorFecha,
    exportarReporte,
};