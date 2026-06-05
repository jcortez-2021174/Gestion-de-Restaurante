import { authApi, ApiError } from '@/shared/apis/api';

/**
 * SERVICIO DE USUARIOS (alineado a UsersController.cs)
 * Endpoints expuestos:
 *  - PUT  /api/v1/users/{userId}/role       -> UpdateUserRole
 *  - GET  /api/v1/users/{userId}/roles      -> GetUserRoles
 *  - GET  /api/v1/users/by-role/{roleName} -> GetUsersByRole
 */

const USERS_BASE = '/v1/users';

export const updateUserRole = async (userId, roleName) => {
  try {
    if (!userId || !roleName) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'userId y roleName requeridos',
        userMessage: 'Datos inválidos.',
        statusCode: 400,
      });
    }

    const response = await authApi.put(`${USERS_BASE}/${userId}/role`, { roleName });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'ROLE_UPDATE_FAILED',
        message: response.data?.message || 'Error al actualizar rol',
        userMessage: 'No se pudo actualizar el rol del usuario.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'ROLE_UPDATE_ERROR',
      message: error.message,
      userMessage: 'Error al actualizar el rol.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const getUserRoles = async (userId) => {
  try {
    if (!userId) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'userId requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await authApi.get(`${USERS_BASE}/${userId}/roles`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'USER_ROLES_FETCH_FAILED',
        message: response.data?.message || 'Error al obtener roles',
        userMessage: 'No se pudieron obtener los roles del usuario.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'USER_ROLES_ERROR',
      message: error.message,
      userMessage: 'Error al obtener roles del usuario.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const getUsersByRole = async (roleName) => {
  try {
    if (!roleName) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'roleName requerido',
        userMessage: 'Rol inválido.',
        statusCode: 400,
      });
    }

    const response = await authApi.get(`${USERS_BASE}/by-role/${encodeURIComponent(roleName)}`);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'USERS_BY_ROLE_FETCH_FAILED',
        message: response.data?.message || 'Error al obtener usuarios por rol',
        userMessage: 'No se pudieron obtener los usuarios.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'USERS_BY_ROLE_ERROR',
      message: error.message,
      userMessage: 'Error al obtener usuarios por rol.',
      statusCode: error.response?.status || 500,
    });
  }
};

export default {
  updateUserRole,
  getUserRoles,
  getUsersByRole,
};
