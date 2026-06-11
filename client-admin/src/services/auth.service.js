import { authApi, ApiError } from '@/shared/apis/api';
import { getRegistrationErrorMessage } from '@/features/auth/registration.validation';
import { createRegistrationFormData } from '@/features/auth/registration.contract';
import { AUTH_STORAGE_KEY } from '@/features/auth/auth.storage';
import { cachedGet } from '@/shared/apis/request-cache';

/**
 * SERVICIO DE AUTENTICACIÓN (alineado a AuthController.cs)
 * Base: /auth (the Axios instance already includes /api/v1)
 */

const AUTH_BASE = '/auth';

export const login = async (emailOrUsername, password) => {
  try {
    if (!emailOrUsername || !password) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Email y contraseña son requeridos',
        userMessage: 'Por favor ingresa tu email y contraseña',
        statusCode: 400,
      });
    }

    const response = await authApi.post(`${AUTH_BASE}/login`, {
      emailOrUsername,
      password,
    });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'LOGIN_FAILED',
        message: response.data.message || 'Login fallido',
        userMessage: 'Credenciales inválidas. Verifica tu email y contraseña.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'LOGIN_ERROR',
      message: error.message,
      userMessage: 'Error al iniciar sesión. Intenta de nuevo.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const register = async (userData) => {
  try {
    const {
      name,
      surname,
      username,
      email,
      password,
      phone,
      profilePicture,
    } = userData || {};

    if (!name || !surname || !username || !email || !password || !phone) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Campos requeridos faltantes',
        userMessage: 'Por favor completa los campos requeridos.',
        statusCode: 400,
      });
    }

    const fd = createRegistrationFormData({
      name,
      surname,
      username,
      email,
      password,
      phone,
      profilePicture,
    });

    const response = await authApi.post(`${AUTH_BASE}/register`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.status !== 201 && response.status !== 200) {
      throw new ApiError({
        code: response.data?.errorCode || 'REGISTER_FAILED',
        message: response.data?.message || 'Registro fallido',
        userMessage: getRegistrationErrorMessage(response.data),
        statusCode: response.status,
        details: response.data?.errors,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'REGISTER_ERROR',
      message: error.message,
      userMessage: 'Error al registrar. Intenta de nuevo.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Refresh token requerido',
        userMessage: 'Token de actualización inválido.',
        statusCode: 400,
      });
    }

    const response = await authApi.post(`${AUTH_BASE}/refresh`, { refreshToken });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'REFRESH_FAILED',
        message: 'Token refresh fallido',
        userMessage: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'REFRESH_ERROR',
      message: error.message,
      userMessage: 'Error al renovar sesión.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const logout = async () => {
  try {
    // Enviar refreshToken en body como requiere el backend
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    let refreshToken = null;
    try {
      const parsed = JSON.parse(stored || '{}');
      refreshToken = parsed.state?.refreshToken || null;
    } catch {
      refreshToken = null;
    }

    const payload = refreshToken ? { refreshToken } : {};
    const response = await authApi.post(`${AUTH_BASE}/logout`, payload);
    return response.data || { message: 'Sesión cerrada' };
  } catch {
    console.warn('Logout request failed, but clearing local session anyway');
    return { message: 'Logged out' };
  }
};

export const getProfile = async () => {
  try {
    const response = await cachedGet(authApi, `${AUTH_BASE}/profile`, {}, 30000);

    if (response.status !== 200) {
      throw new ApiError({
        code: 'PROFILE_FETCH_FAILED',
        message: 'Error al obtener perfil',
        userMessage: 'Error al cargar tu perfil.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PROFILE_ERROR',
      message: error.message,
      userMessage: 'Error al cargar tu perfil.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const getProfileById = async (userId) => {
  try {
    if (!userId) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'userId requerido',
        userMessage: 'ID inválido.',
        statusCode: 400,
      });
    }

    const response = await authApi.post(`${AUTH_BASE}/profile/by-id`, { userId });

    if (response.status !== 200) {
      throw new ApiError({
        code: 'PROFILE_NOT_FOUND',
        message: response.data?.message || 'Usuario no encontrado',
        userMessage: 'Usuario no encontrado.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PROFILE_BY_ID_ERROR',
      message: error.message,
      userMessage: 'Error al obtener el perfil.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const requestPasswordReset = async (email) => {
  try {
    if (!email || !email.includes('@')) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Email inválido',
        userMessage: 'Por favor ingresa un email válido.',
        statusCode: 400,
      });
    }

    const response = await authApi.post(`${AUTH_BASE}/forgot-password`, { email });

    if (response.status !== 200 && response.status !== 201) {
      throw new ApiError({
        code: 'PASSWORD_RESET_REQUEST_FAILED',
        message: response.data.message || 'Error al solicitar reset',
        userMessage: 'Error al procesar tu solicitud.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PASSWORD_RESET_REQUEST_ERROR',
      message: error.message,
      userMessage: 'Error al procesar tu solicitud.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    if (!token) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Token de reset inválido',
        userMessage: 'El link de reset es inválido o ha expirado.',
        statusCode: 400,
      });
    }

    if (!newPassword || newPassword.length < 8) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Contraseña inválida',
        userMessage: 'La contraseña debe tener al menos 8 caracteres.',
        statusCode: 400,
      });
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Las contraseñas no coinciden',
        userMessage: 'Las contraseñas no coinciden.',
        statusCode: 400,
      });
    }

    const response = await authApi.post(`${AUTH_BASE}/reset-password`, {
      token,
      newPassword,
      confirmPassword,
    });

    if (response.status !== 200 || response.data?.success === false) {
      throw new ApiError({
        code: 'PASSWORD_RESET_FAILED',
        message: response.data.message || 'Error al cambiar contraseña',
        userMessage: response.data?.message || 'Error al cambiar tu contraseña.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'PASSWORD_RESET_ERROR',
      message: error.message,
      userMessage: 'Error al cambiar tu contraseña.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const verifyEmail = async (token) => {
  try {
    if (!token) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Token de verificación inválido',
        userMessage: 'El link de verificación es inválido o ha expirado.',
        statusCode: 400,
      });
    }

    const response = await authApi.post(`${AUTH_BASE}/verify-email`, { token });

    if (response.status !== 200 || response.data?.success === false) {
      throw new ApiError({
        code: 'EMAIL_VERIFY_FAILED',
        message: response.data.message || 'Error al verificar email',
        userMessage: response.data?.message || 'El enlace de verificación es inválido o ha expirado.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'EMAIL_VERIFY_ERROR',
      message: error.message,
      userMessage: 'Error al verificar tu email.',
      statusCode: error.response?.status || 500,
    });
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    if (!email || !email.includes('@')) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Email inválido',
        userMessage: 'Por favor ingresa un email válido.',
        statusCode: 400,
      });
    }

    const response = await authApi.post(`${AUTH_BASE}/resend-verification`, { email });

    if (response.status !== 200 && response.status !== 201) {
      throw new ApiError({
        code: 'EMAIL_RESEND_FAILED',
        message: response.data.message || 'Error al reenviar email',
        userMessage: 'Error al reenviar el email de verificación.',
        statusCode: response.status,
      });
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      code: 'EMAIL_RESEND_ERROR',
      message: error.message,
      userMessage: 'Error al reenviar el email de verificación.',
      statusCode: error.response?.status || 500,
    });
  }
};

export default {
  login,
  register,
  refreshToken,
  logout,
  getProfile,
  getProfileById,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};
