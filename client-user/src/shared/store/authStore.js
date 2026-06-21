// src/shared/store/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const AUTH_STORAGE_KEY = 'aurea-auth-store';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      refreshToken: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: async (accessToken, user, refreshToken) => {
        set({
          token: accessToken,
          user,
          refreshToken,
          isAuthenticated: true,
        });
        if (refreshToken) {
          await SecureStore.setItemAsync('aurea_refresh_token', refreshToken);
        }
      },

      logout: async () => {
        set({
          token: null,
          user: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        await SecureStore.deleteItemAsync('aurea_refresh_token');
      },

      setAccessToken: (token) => {
        set({ token, isAuthenticated: Boolean(token) });
      },

      updateUser: (user) => {
        set({ user });
      },

      setRefreshToken: (refreshToken) => {
        set({ refreshToken });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state._hasHydrated = true;
      },
    }
  )
);
