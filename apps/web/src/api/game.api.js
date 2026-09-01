import apiClient from "./client";

export const getGame = async (gameId) => {
    const response = await apiClient.get(`/games/${gameId}`);

    return response.data;
};

export const makeGameMove = async (gameId, move) => {
    const response = await apiClient.post(`/games/${gameId}/moves`, move);
    return response.data;
};