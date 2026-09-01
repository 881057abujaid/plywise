import apiClient from "./client";

export const createMatch = async ({ mode, botDifficulty }) => {
    const response = await apiClient.post("/matches", {
        mode,
        botDifficulty,
    });

    return response.data;
};