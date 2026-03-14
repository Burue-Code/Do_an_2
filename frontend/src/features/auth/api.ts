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
