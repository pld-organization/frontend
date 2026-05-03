import axios from 'axios';
import { ensureValidAccessToken } from '../../../services/apiClient';

/**
 * Production-level API Client configuration.
 * Separates concerns and provides consistent interceptor handling across microservices.
 */

export const STORAGE_BASE_URL = 'https://storage-service-yxqy.onrender.com';
export const AUTH_BASE_URL = 'https://authservice-version-90.onrender.com';

/**
 * Configures common interceptors for an Axios instance.
 * @param {import('axios').AxiosInstance} instance 
 */
const setupInterceptors = (instance) => {
  // Request: Attach Authorization Header and ensure token is fresh
  instance.interceptors.request.use(
    async (config) => {
      // Use the global utility to get a fresh token (handles refresh if needed)
      const token = await ensureValidAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response: Global Error Normalization
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      // Handle specific status codes
      if (status === 401) {
        console.warn('[API] Session expired or unauthorized.');
      }

      // Standardize the error object for the UI
      const normalizedError = {
        status,
        message,
        originalError: error,
      };

      return Promise.reject(normalizedError);
    }
  );

  return instance;
};

/**
 * Base configuration for all instances
 */
const baseConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s timeout for production reliability
};

// Export specialized instances
export const storageInstance = setupInterceptors(
  axios.create({ ...baseConfig, baseURL: STORAGE_BASE_URL })
);

export const authInstance = setupInterceptors(
  axios.create({ ...baseConfig, baseURL: AUTH_BASE_URL })
);

// Generic client for any other needs
const apiClient = setupInterceptors(axios.create(baseConfig));

export default apiClient;