import { api } from '@/lib/axios';
import type { AuthResponse, UserProfile } from './types';

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  fullName: string;
  password: string;
}

export interface UpdateProfileParams {
  fullName: string;
  phoneNumber: string | null;
  email: string | null;
}

export async function login(params: LoginParams): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', params);
  return data;
}

export async function register(params: RegisterParams): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', params);
  return data;
}

export async function fetchMe(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/auth/me');
  return data;
}

/** Profile đầy đủ (gồm favoriteGenreIds) từ GET /users/me — dùng cho trang profile để tick thể loại đã lưu */
export async function fetchProfileForPage(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/users/me');
  return data;
}

export async function updateProfile(params: UpdateProfileParams): Promise<UserProfile> {
  const { data } = await api.patch<UserProfile>('/auth/me', params);
  return data;
}

export async function updateFavoriteGenres(genreIds: number[]): Promise<void> {
  await api.put('/users/me/favorite-genres', { genreIds });
}

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

/** Đổi mật khẩu (yêu cầu đăng nhập) */
export async function changePassword(params: ChangePasswordParams): Promise<void> {
  await api.post('/auth/change-password', params);
}
