/**
 * Axios instance with:
 *   - Bearer token injection on every request
 *   - Automatic token refresh on 401 (with request queue)
 *   - Global error notification via Redux
 *   - Multipart upload helper
 */
import axios from 'axios';
import API from '@/constants/api';
import { useAuthStore } from '@/store/authStore';

// ── Create instance ──────────────────────────────────────────────────────────
const http = axios.create({
  baseURL: API.BASE,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept:         'application/json',
  },
  withCredentials: true,
});

// ── Refresh-token queue (prevents parallel refresh calls) ────────────────────
let isRefreshing   = false;
let pendingQueue   = []; // [{ resolve, reject }]

const flushQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  pendingQueue = [];
};

// ── REQUEST interceptor — attach Bearer token ────────────────────────────────
http.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE interceptor — 401 → refresh → retry ────────────────────────────
http.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    // Only attempt refresh on 401 and only once per request
    if (error.response?.status === 401 && !original._retry) {

      // If another refresh is already running, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            return http(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing    = true;

      try {
        // Call refresh endpoint (uses the existing token in the header)
        const { data } = await http.post(API.AUTH.REFRESH);
        const newToken = data.token;

        // Persist new token
        const { user } = useAuthStore.getState();
        useAuthStore.getState().login(user, newToken);

        // Flush queued requests with new token
        flushQueue(null, newToken);

        // Retry original request
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);

      } catch (refreshError) {
        flushQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Convenience methods ──────────────────────────────────────────────────────
export const apiGet    = (url, params = {}) => http.get(url, { params });
export const apiPost   = (url, data = {})   => http.post(url, data);
export const apiPut    = (url, data = {})   => http.put(url, data);
export const apiPatch  = (url, data = {})   => http.patch(url, data);
export const apiDelete = (url)              => http.delete(url);

/** Multipart file upload */
export const apiUpload = (url, formData, onProgress) =>
  http.post(url, formData, {
    headers:          { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
      ? (e) => onProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
      : undefined,
  });

/** PUT with file upload */
export const apiUploadPut = (url, formData, onProgress) =>
  http.put(url, formData, {
    headers:          { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
      ? (e) => onProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
      : undefined,
  });

export default http;
