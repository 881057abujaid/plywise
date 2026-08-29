import apiClient from "./client";

export const signup = async (credentials) => {
    const response = await apiClient.post("/auth/signup", credentials);

    return response.data;
};

export const login = async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);

    return response.data;
};

export const getMe = async () => {
    const response = await apiClient.get("auth/me");

    return response.data;
};