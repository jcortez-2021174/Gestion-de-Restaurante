import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosAuth } from '../../../shared/apis/api';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            error: null,
            isAuthenticated: false,

            // Función para cerrar sesión
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            clearError: () => set({ error: null }),
            // Función para iniciar sesión (Llamada directa a la API)
            login: async ({ emailOrUsername, password }) => {
                try {
                    set({ loading: true, error: null });

                    // Petición directa a tu backend de .NET
                    const response = await axiosAuth.post('/auth/login', { 
                        emailOrUsername, 
                        password 
                    });

                    const data = response.data;

                    // IMPORTANTE: Ajusta 'accessToken' y 'userDetails' 
                    // según lo que devuelva tu controlador de C#
                    set({
                        user: data.userDetails,
                        token: data.accessToken,
                        isAuthenticated: true,
                        loading: false,
                    });

                    return { success: true };
                } catch (err) {
                    const message = err.response?.data?.message || "Error al iniciar sesión";
                    set({ error: message, loading: false });
                    return { success: false, error: message };
                }
            },
        }),
        { name: "auth-restaurante-Aurea" } // Nombre único para tu proyecto
    )
);