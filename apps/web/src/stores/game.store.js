import { create } from "zustand";

import { getGame as getGameApi, makeGameMove as makeGameMoveApi } from "../api/game.api";

const useGameStore = create((set) => ({
    game: null,
    isLoading: false,
    isMoving: false,
    error: null,

    // Actions
    getGame: async (gameId) => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const response = await getGameApi(gameId);

            set({
                game: response.data,
                isLoading: false,
            });

            return response.data;
        } catch (error) {
            set({
                game: null,
                isLoading: false,
                error: error.response?.data?.message || "Failed to load game."
            });

            throw error;
        }
    },

    makeMove: async (gameId, move) => {
        set({
            isMoving: true,
            error: null,
        });

        try {
            const response = await makeGameMoveApi(gameId, move);
            const result = response.data;

            set((state) => ({
                game: state.game ? {
                    ...state.game,
                    board: result.board,
                    turn: result.turn,
                    status: result.status,
                    result: result.result,
                    moves: result.moves,
                } : state.game,
                isMoving: false,
            }));

            return result;
        } catch (error) {
            set({
                isMoving: false,
                error: error.response?.data?.message || "Failed to make move.",
            });

            throw error;
        }
    },

    clearGame: () => {
        set({
            game: null,
            isLoading: false,
            isMoving: false,
            error: null,
        });
    },
}));

export default useGameStore;