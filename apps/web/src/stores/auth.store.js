import { create } from "zustand";
import { login as loginApi, signup as signupApi, getMe as getMeApi } from "../api/auth.api";
import { setAccessToken, clearAccessToken } from "../api/client";

const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,

    // Actions
    login: async (credentials) => {
        set({ isLoading: true });

        try {
            const response = await loginApi(credentials);
            const { user, accessToken } = response.data;

            setAccessToken(accessToken);

            set({
                user,
                accessToken,
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
        clearAccessToken();
        set({
            user: null,
            accessToken: null,
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
            clearAccessToken();
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false,
            });

            throw error;
        }
    },
}));

export default useAuthStore;