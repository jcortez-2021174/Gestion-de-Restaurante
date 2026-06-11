import { restaurantApi, ApiError } from '../shared/apis/api';

const DASHBOARD_BASE = '/dashboard';

export const obtenerEstadisticas = async (rango = '30d') => {
    try {
        const response = await restaurantApi.get(`${DASHBOARD_BASE}/stats`, { params: { rango } });
        if (response.status !== 200) {
            throw new ApiError({
                code: 'STATISTICS_FETCH_FAILED',
                message: 'Error al obtener estadísticas',
                userMessage: 'Error al cargar las estadísticas.',
                statusCode: response.status,
            });
        }
        // Backend returns { ok: true, stats: {...} }, extract stats
        return response.data.stats || response.data;
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
        // Backend doesn't have this endpoint yet, return empty data for now
        // TODO: Implement backend endpoint /dashboard/ventas
        return { ventas: [], total: 0 };
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
        // Backend doesn't have this endpoint yet, return empty data for now
        // TODO: Implement backend endpoint /dashboard/productos-vendidos
        return { productos: [] };
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
        // Backend doesn't have this endpoint yet, return empty data for now
        // TODO: Implement backend endpoint /dashboard/ordenes-estado
        return { ordenes: [] };
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
        // Backend doesn't have this endpoint yet, return empty data for now
        // TODO: Implement backend endpoint /dashboard/clientes-frecuentes
        return { clientes: [] };
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
        // Backend doesn't have this endpoint yet, return empty data for now
        // TODO: Implement backend endpoint /dashboard/grafico-ingresos
        return { datos: [], labels: [] };
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
        // Backend doesn't have this endpoint yet, return empty data for now
        // TODO: Implement backend endpoint /dashboard/ocupacion-mesas
        return { ocupacion: [] };
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
        // Backend doesn't have this endpoint yet, return empty data for now
        // TODO: Implement backend endpoint /dashboard/reservas-fecha
        return { reservaciones: [] };
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
        // Backend doesn't have this endpoint yet, return error for now
        // TODO: Implement backend endpoint /dashboard/exportar-reporte
        throw new ApiError({
            code: 'NOT_IMPLEMENTED',
            message: 'Exportación de reportes no implementada aún',
            userMessage: 'Esta función no está disponible actualmente.',
            statusCode: 501,
        });
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