import { create } from "zustand";
import {
    getMyProfile as getMyProfileApi,
    updateMyProfile as updateMyProfileApi
} from "../api/player.api";

const usePlayerStore = create((set) => ({
    player: null,
    isLoading: false,
    isUpdating: false,
    error: null,

    // Actions
    getMyProfile: async () => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const response = await getMyProfileApi();

            set({
                player: response.data,
                isLoading: false,
            });

            return response.data;
        } catch (error) {
            set({
                player: null,
                isLoading: false,
                error: error.response?.data?.message || "Failed to load player profile.",
            });

            throw error;
        }
    },

    updateMyProfile: async (updates) => {
        set({
            isUpdating: true,
            error: null,
        });

        try {
            const response = await updateMyProfileApi(updates);

            set({
                player: response.data,
                isUpdating: false,
            });

            return response.data;
        } catch (error) {
            set({
                isUpdating: false,
                error: error.response?.data?.message || "Failed to update player profile.",
            });

            throw error;
        }
    },
}));

export default usePlayerStore;