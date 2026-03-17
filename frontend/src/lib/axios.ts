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
  (error) => {
    const status = error?.response?.status;
    // Ưu tiên lấy message từ response để UI hiển thị đúng (thay vì "Request failed with status code ...")
    const serverMessage = error?.response?.data?.message;
    if (typeof serverMessage === 'string' && serverMessage.trim()) {
      error.message = serverMessage;
    }
    if (typeof window !== 'undefined' && status === 401) {
      const url = String(error?.config?.url ?? '');
      // Chỉ auto-logout/redirect khi request xác minh session (me) bị 401.
      // Các API khác (kể cả /admin/**) trả 401 thì để UI tự hiển thị lỗi, tránh "đá ra luôn".
      if (url.startsWith('/auth/me')) {
        try {
          localStorage.removeItem('accessToken');
        } catch {
          // ignore
        }
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
