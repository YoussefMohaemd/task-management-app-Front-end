import axios from 'axios';
import { normalizeAxiosError } from '../utils/errors';

export const TOKEN_STORAGE_KEY = 'taskflow.token';

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

const isAuthEndpoint = (url) => typeof url === 'string' && url.includes('/auth/');

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401 && !isAuthEndpoint(url) && !error.config?._retry401) {
      error.config._retry401 = true;
      if (onUnauthorized) {
        onUnauthorized();
      }
    }

    return Promise.reject(normalizeAxiosError(error));
  }
);

export default apiClient;
