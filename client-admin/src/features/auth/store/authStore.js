import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../../../shared/apis/api';
import {
  getProfile,
  logout as logoutUser,
  register as registerUser,
} from '../../../services/auth.service';
import { AUTH_STORAGE_KEY, clearPersistedSession } from '../auth.storage';
import { getJwtRole } from '../jwt.claims';
import { invalidateRequestCache } from '../../../shared/apis/request-cache';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      hydrateProfile: async () => {
        try {
          const response = await getProfile();
          const profile = response?.data || response;
          set((state) => ({
            user: {
              ...state.user,
              ...profile,
              role: profile?.role || state.user?.role,
            },
          }));
          return profile;
        } catch {
          return null;
        }
      },

      logout: async () => {
        await logoutUser();
        invalidateRequestCache();
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
        clearPersistedSession();
      },

      clearError: () => set({ error: null }),

      register: async (userData) => {
        try {
          set({ loading: true, error: null });
          const data = await registerUser(userData);
          set({ loading: false, error: null });
          return { success: true, data };
        } catch (error) {
          const message =
            error.userMessage ||
            error.response?.data?.message ||
            'No fue posible crear la cuenta.';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      login: async ({ emailOrUsername, password }) => {
        try {
          set({ loading: true, error: null });
          const response = await authApi.post('/auth/login', {
            emailOrUsername,
            password,
          });
          const data = response.data;

          if (response.status !== 200 || !data.accessToken) {
            const message = data.message || 'Credenciales invalidas';
            set({ error: message, loading: false });
            return { success: false, error: message };
          }

          const tokenRole = getJwtRole(data.accessToken);

          set({
            user: {
              ...data.userDetails,
              role: tokenRole || data.userDetails?.role,
            },
            token: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          const message =
            error.userMessage ||
            error.response?.data?.message ||
            'Error al iniciar sesion';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
    }),
    { name: AUTH_STORAGE_KEY }
  )
);
