import { create } from "zustand";
import { login as loginApi, signup as signupApi, getMe as getMeApi } from "../api/auth.api";

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true,

    // Actions
    login: async (credentials) => {
        set({ isLoading: true });

        try {
            const response = await loginApi(credentials);
            const { user } = response.data;

            set({
                user,
                isAuthenticated: true,
                isLoading: false,
            });

            return response;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    signup: async (credentials) => {
        set({ isLoading: true });

        try {
            const response = await signupApi(credentials);

            set({ isLoading: false });

            return response;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    },

    getMe: async () => {
        set({ isLoading: true });

        try {
            const response = await getMeApi();
            const user = response.data;

            set({
                user,
                isAuthenticated: true,
                isLoading: false,
            });

            return user;
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });

            throw error;
        }
    },

    initializeAuth: async () => {
        set({ isInitializing: true });

        try {
            const response = await getMeApi();
            const user = response.data;

            set({
                user,
                isAuthenticated: true,
                isInitializing: false,
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isInitializing: false,
            });

            throw error;
        }
    }
}));

export default useAuthStore;