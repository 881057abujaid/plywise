import apiClient from "./client";

export const signup = async (credentials) => {
    const response = await apiClient.post("/auth/signup", credentials);

    return response.data;
};

export const login = async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);

    return response.data;
};

export const getMe = async (accessToken) => {
    const response = await apiClient.get("auth/me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};