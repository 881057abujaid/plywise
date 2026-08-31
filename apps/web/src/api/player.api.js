import apiClient from "./client";

export const getMyProfile = async () => {
    const response = await apiClient.get("/players/me");

    return response.data;
};

export const updateMyProfile = async (updates) => {
    const response = await apiClient.patch("players/me", updates);

    return response.data;
};