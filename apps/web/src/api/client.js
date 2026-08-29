import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const clearAccessToken = () => {
    accessToken = null;
};

apiClient.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;