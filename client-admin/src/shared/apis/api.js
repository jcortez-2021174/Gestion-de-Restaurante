import axios from 'axios';
import { AUTH_STORAGE_KEY, readPersistedAuth } from '@/features/auth/auth.storage';

/**
 * CAPA DE CONFIGURACIÓN - API HTTP
 * 
 * Responsabilidad: Crear instancias de Axios con interceptores
 * para autenticación (.NET) y negocio (Node.js)
 */

// Variables de entorno
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5022/api/v1';
const RESTAURANT_API_URL =
  import.meta.env.VITE_RESTAURANT_API_URL ||
  'http://localhost:3020/AureaRestaurant/Admin/v1';const REQUEST_TIMEOUT = parseInt(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000;
const LOG_REQUESTS = import.meta.env.VITE_LOG_REQUESTS === 'true';

/*
 * Cliente Axios para el servicio de autenticación (.NET)
 * Endpoint base: http://localhost:5022/api
 */
export const authApi = axios.create({
  baseURL: AUTH_API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  validateStatus: (status) => status < 500, // Aceptar 4xx (manejar en interceptor)
});

/**
 * Cliente Axios para el servicio de negocio (Node.js)
 * Endpoint base: http://localhost:3020/api/v1
 */
export const restaurantApi = axios.create({
  baseURL: RESTAURANT_API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  validateStatus: (status) => status < 500,
});

/**
 * Clase personalizada para errores de API
 * Normaliza errores HTTP a un formato consistente
 */
export class ApiError extends Error {
  constructor(config = {}) {
    super(config.message);
    this.code = config.code || 'UNKNOWN_ERROR';
    this.message = config.message || 'Error desconocido';
    this.userMessage = config.userMessage || 'Ocurrió un error. Intenta de nuevo.';
    this.statusCode = config.statusCode || 500;
    this.details = config.details || {};
    this.retryable = config.retryable !== undefined ? config.retryable : false;
    this.timestamp = new Date().toISOString();
    this.name = 'ApiError';
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      statusCode: this.statusCode,
      details: this.details,
      retryable: this.retryable,
      timestamp: this.timestamp,
    };
  }
}

// ============================================================================
// 3. FUNCIONES AUXILIARES DE ERROR
// ============================================================================

/**
 * Mapea código HTTP a objeto de error personalizado
 */
function mapHttpError(statusCode, responseData = {}) {
  const errorMapping = {
    400: {
      code: 'BAD_REQUEST',
      userMessage: 'Los datos enviados son inválidos.',
      retryable: false,
    },
    401: {
      code: 'UNAUTHORIZED',
      userMessage: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      retryable: false,
    },
    403: {
      code: 'FORBIDDEN',
      userMessage: 'No tienes permiso para acceder a este recurso.',
      retryable: false,
    },
    404: {
      code: 'NOT_FOUND',
      userMessage: 'El recurso solicitado no existe.',
      retryable: false,
    },
    409: {
      code: 'CONFLICT',
      userMessage: 'Hay un conflicto con los datos enviados. El registro ya existe.',
      retryable: false,
    },
    422: {
      code: 'VALIDATION_ERROR',
      userMessage: 'Por favor, verifica los datos ingresados.',
      retryable: false,
    },
    429: {
      code: 'RATE_LIMITED',
      userMessage: 'Demasiadas solicitudes. Intenta más tarde.',
      retryable: true,
    },
    500: {
      code: 'SERVER_ERROR',
      userMessage: 'Error en el servidor. Intenta más tarde.',
      retryable: false,
    },
    502: {
      code: 'BAD_GATEWAY',
      userMessage: 'El servidor no responde. Intenta más tarde.',
      retryable: true,
    },
    503: {
      code: 'SERVICE_UNAVAILABLE',
      userMessage: 'El servicio no está disponible. Intenta más tarde.',
      retryable: true,
    },
    504: {
      code: 'GATEWAY_TIMEOUT',
      userMessage: 'El servidor tardó demasiado. Intenta de nuevo.',
      retryable: true,
    },
  };

  const errorConfig = errorMapping[statusCode] || {
    code: 'UNKNOWN_ERROR',
    userMessage: 'Ocurrió un error desconocido.',
    retryable: false,
  };

  return new ApiError({
    ...errorConfig,
    statusCode,
    message: responseData.message || errorConfig.userMessage,
    details: responseData.errors || {},
  });
}

/**
 * Maneja errores de red
 */
function handleNetworkError(error) {
  if (error.code === 'ECONNABORTED') {
    return new ApiError({
      code: 'TIMEOUT_ERROR',
      message: 'La solicitud tardó demasiado. Intenta de nuevo.',
      userMessage: 'Conexión lenta. Intenta de nuevo.',
      statusCode: 0,
      retryable: true,
    });
  }

  if (error.code === 'ERR_NETWORK') {
    return new ApiError({
      code: 'NETWORK_ERROR',
      message: 'Sin conexión a internet.',
      userMessage: 'Verifica tu conexión a internet.',
      statusCode: 0,
      retryable: true,
    });
  }

  return new ApiError({
    code: 'NETWORK_ERROR',
    message: error.message || 'Error de red desconocido.',
    userMessage: 'Error de conexión. Intenta de nuevo.',
    statusCode: 0,
    retryable: true,
  });
}

// ============================================================================
// 4. LOGGING
// ============================================================================

/**
 * Loguea solicitudes HTTP (solo en desarrollo)
 */
function logRequest(config) {
  if (!LOG_REQUESTS) return;
  
  console.log(`[HTTP REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
  if (config.data) {
    console.log('[DATA]', config.data);
  }
}

/**
 * Loguea respuestas HTTP (solo en desarrollo)
 */
function logResponse(response) {
  if (!LOG_REQUESTS) return;
  
  console.log(`[HTTP RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
}

/**
 * Loguea errores HTTP
 */
function logError(error, context = '') {
  console.error(`[HTTP ERROR] ${context}`, error.toJSON?.() || error);
}

// ============================================================================
// 5. GESTIÓN DE TOKENS
// ============================================================================

let isRefreshing = false;
let failedQueue = [];

/**
 * Procesa la cola de requests que fallaron por 401
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Obtiene el token del localStorage
 */
function getToken() {
  try {
    return readPersistedAuth()?.state?.token || null;
  } catch (error) {
    console.error('[TOKEN] Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Obtiene el refresh token del localStorage
 */
function getRefreshToken() {
  try {
    return readPersistedAuth()?.state?.refreshToken || null;
  } catch (error) {
    console.error('[REFRESH_TOKEN] Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Actualiza el token en localStorage
 */
function setToken(token) {
  try {
    const parsed = readPersistedAuth();
    if (!parsed) return;
    parsed.state.token = token;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('[TOKEN] Error writing to localStorage:', error);
  }
}

/**
 * Intenta refrescar el token
 */
async function refreshAccessToken(refreshToken) {
  try {
    const response = await authApi.post('/auth/refresh', {
      refreshToken,
    });

    if (response.status === 200 && response.data.accessToken) {
      const newToken = response.data.accessToken;
      setToken(newToken);
      return newToken;
    }

    throw new Error('Invalid refresh response');
  } catch (error) {
    logError(error, '[REFRESH_TOKEN]');
    // Limpiar tokens del localStorage
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Redirigir a login (lo hace el app global)
    window.location.href = '/login';
    throw error;
  }
}

// ============================================================================
// 6. INTERCEPTOR DE REQUEST
// ============================================================================

/**
 * Interceptor de request: Añade JWT automáticamente
 */
function setupRequestInterceptor(instance) {
  instance.interceptors.request.use(
    (config) => {
      // Obtener token
      const token = getToken();

      // Añadir token si existe (excepto en endpoints públicos)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Generar request ID para correlación
      config.headers['X-Request-ID'] = crypto.randomUUID?.() || Date.now().toString();

      // Loguear
      logRequest(config);

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

// ============================================================================
// 7. INTERCEPTOR DE RESPONSE
// ============================================================================

/**
 * Interceptor de response: Maneja 401, errores, normaliza
 */
function setupResponseInterceptor(instance) {
  instance.interceptors.response.use(
    (response) => {
      logResponse(response);
      return response;
    },
    async (error) => {
      const { config, response } = error;

      // No aplicar lógica especial si ya es un retry
      if (config.__isRetry) {
        if (response?.status === 401) {
          // Redirigir a login
          localStorage.removeItem(AUTH_STORAGE_KEY);
          window.location.href = '/login';
        }
        return Promise.reject(mapHttpError(response?.status || 500, response?.data));
      }

      // Error de red (sin response del servidor)
      if (!response) {
        const networkError = handleNetworkError(error);
        logError(networkError);
        return Promise.reject(networkError);
      }

      // Manejar 401: Intentar refrescar token
      if (response.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
              // No hay refresh token, forzar login
              localStorage.removeItem(AUTH_STORAGE_KEY);
              window.location.href = '/login';
              isRefreshing = false;
              return Promise.reject(
                new ApiError({
                  code: 'UNAUTHORIZED',
                  userMessage: 'Tu sesión ha expirado. Por favor, inicia sesión.',
                  statusCode: 401,
                  retryable: false,
                })
              );
            }

            // Intentar refrescar
            const newToken = await refreshAccessToken(refreshToken);

            // Actualizar header del request original
            config.headers.Authorization = `Bearer ${newToken}`;
            config.__isRetry = true; // Marcar como retry

            // Procesar queue
            processQueue(null, newToken);
            isRefreshing = false;

            // Reintentar request original
            return instance(config);
          } catch (err) {
            processQueue(err, null);
            isRefreshing = false;

            // Redirigir a login
            localStorage.removeItem(AUTH_STORAGE_KEY);
            window.location.href = '/login';

            return Promise.reject(
              new ApiError({
                code: 'UNAUTHORIZED',
                userMessage: 'Tu sesión ha expirado. Por favor, inicia sesión.',
                statusCode: 401,
                retryable: false,
              })
            );
          }
        }

        // Si ya está refrescando, añadir a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              config.headers.Authorization = `Bearer ${token}`;
              config.__isRetry = true;
              resolve(instance(config));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      // Otros errores HTTP
      const apiError = mapHttpError(response.status, response.data);
      logError(apiError);

      return Promise.reject(apiError);
    }
  );
}

// ============================================================================
// 8. SETUP GLOBAL
// ============================================================================

/**
 * Configura interceptores en ambas instancias
 */
export function setupInterceptors() {
  setupRequestInterceptor(authApi);
  setupResponseInterceptor(authApi);

  setupRequestInterceptor(restaurantApi);
  setupResponseInterceptor(restaurantApi);
}

// Llamar automáticamente
setupInterceptors();

// ============================================================================
// 9. EXPORTAR
// ============================================================================

export default authApi;

