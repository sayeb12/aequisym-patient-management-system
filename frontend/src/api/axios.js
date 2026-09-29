import axios from "axios";

import {
    getAccessToken,
    getRefreshToken,
    logout,
    setAccessToken,
} from "../utils/auth";


const API_BASE_URL = "http://127.0.0.1:8000/api/";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// This client deliberately has no auth interceptors. It prevents an expired
// access token from blocking the refresh request itself.
const refreshClient = axios.create({
    baseURL: API_BASE_URL,
});

let refreshPromise = null;


api.interceptors.request.use(
    (config) => {
        if (config.skipAuth) {
            return config;
        }

        const accessToken = getAccessToken();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401
            || !originalRequest
            || originalRequest._retry
            || originalRequest.skipAuth
        ) {
            return Promise.reject(error);
        }

        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            logout();
            window.location.replace("/");
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshClient
                    .post("token/refresh/", { refresh: refreshToken })
                    .then((response) => {
                        const newAccessToken = response.data.access;
                        setAccessToken(newAccessToken);
                        return newAccessToken;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newAccessToken = await refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            logout();
            window.location.replace("/");
            return Promise.reject(refreshError);
        }
    }
);


export default api;
