import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'https://micro-marketplace-backend-xtn9.onrender.com';

const instance = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

// Global response logging + improved error surface for easier debugging
instance.interceptors.response.use(
  res => res,
  err => {
    try {
      const status = err.response?.status;
      const url = err.config?.url;
      // Log full error for 5xx to help debug server-side failures
      if (status && status >= 500) {
        // eslint-disable-next-line no-console
        console.error('[API][500] Error calling', url, err.response?.data || err.message, err);
      }
      // Also log other errors (401/400) at debug level
      // eslint-disable-next-line no-console
      console.debug('[API] Request failed', { url, status, data: err.response?.data });
    } catch (e) {
      // ignore
    }
    return Promise.reject(err);
  }
);

export default instance;
