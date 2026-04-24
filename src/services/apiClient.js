import axios from "axios";
import {
  clearAuthSession,
  getStoredAuthSession,
  saveAuthSession,
} from "../utils/authStorage";
import { isTokenExpired } from "../utils/jwt";

const API_BASE_URL =
  import.meta.env.DEV
    ? ""
    : import.meta.env.VITE_AUTH_API_URL ??
      "https://authservice-version-90.onrender.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

async function refreshStoredSession() {
  const currentSession = getStoredAuthSession();

  if (!currentSession?.refreshToken || isTokenExpired(currentSession.refreshToken)) {
    clearAuthSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh", {
        refreshToken: currentSession.refreshToken,
      })
      .then(({ data }) => saveAuthSession(data, currentSession.user))
      .catch((error) => {
        clearAuthSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function ensureValidAccessToken(options = {}) {
  const { forceRefresh = false } = options;
  const currentSession = getStoredAuthSession();

  if (!currentSession) {
    return null;
  }

  if (
    !forceRefresh &&
    currentSession.accessToken &&
    !isTokenExpired(currentSession.accessToken)
  ) {
    return currentSession.accessToken;
  }

  const refreshedSession = await refreshStoredSession();

  return refreshedSession?.accessToken ?? null;
}

apiClient.interceptors.request.use(async (config) => {
  if (config.skipAuth) {
    return config;
  }

  const accessToken = await ensureValidAccessToken();

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !originalRequest ||
      originalRequest.skipAuthRefresh ||
      originalRequest._retry ||
      error.response?.status !== 401
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshedAccessToken = await ensureValidAccessToken({
        forceRefresh: true,
      });

      if (!refreshedAccessToken) {
        return Promise.reject(error);
      }

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export default apiClient;
