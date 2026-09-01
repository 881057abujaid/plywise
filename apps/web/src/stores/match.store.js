import { create } from "zustand";

import { createMatch as createMatchApi } from "../api/match.api";

const useMatchStore = create((set) => ({
    currentMatch: null,
    gameId: null,
    isLoading: false,
    error: null,

    //Actions
    createMatch: async ({ mode, botDifficulty }) => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const response = await createMatchApi({
                mode,
                botDifficulty,
            });

            const { match, gameId } = response.data;

            set({
                currentMatch: match,
                gameId: gameId ?? null,
                isLoading: false,
            });

            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to create match."
            });

            throw error;
        }
    },

    clearMatch: () => {
        set({
            currentMatch: null,
            gameId: null,
            isLoading: false,
            error: null,
        });
    },
}));

export default useMatchStore;