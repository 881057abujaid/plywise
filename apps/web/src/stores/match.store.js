import { create } from "zustand";

import { createMatch as createMatchApi, getMatchHistory as getMatchHistoryApi } from "../api/match.api";

const useMatchStore = create((set) => ({
    currentMatch: null,
    matchHistory: [],
    gameId: null,
    isLoading: false,
    isHistoryLoading: false,
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

    getMatchHistory: async () => {
        set({
            isHistoryLoading: true,
            error: null,
        });

        try {
            const response = await getMatchHistoryApi();

            set({
                matchHistory: response.data,
                isHistoryLoading: false,
            });

            return response.data;
        } catch (error) {
            set({
                isHistoryLoading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to load match history.",
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