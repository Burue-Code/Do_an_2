import axios from 'axios';

const baseURL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

/** BaseResponse theo tech_stack: { success, data, message } */
interface BaseResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

/** Interceptor: gắn Bearer token (không gửi cho login/register để tránh 401 do token cũ) */
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const isAuthEndpoint =
      typeof config.url === 'string' &&
      (config.url.startsWith('/auth/login') || config.url.startsWith('/auth/register'));
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const body = response.data as BaseResponse<unknown> | unknown;
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      response.data = (body as BaseResponse<unknown>).data;
    }
    return response;
  },
  (error) => Promise.reject(error)
);
