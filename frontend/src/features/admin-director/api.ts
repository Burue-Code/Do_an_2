import { api } from '@/lib/axios';
import type { AdminDirector, CreateDirectorPayload, UpdateDirectorPayload } from './types';

export async function fetchAdminDirectors(): Promise<AdminDirector[]> {
  const { data } = await api.get<AdminDirector[]>('/admin/directors');
  return data;
}

export async function fetchAdminDirector(id: number): Promise<AdminDirector> {
  const { data } = await api.get<AdminDirector>(`/admin/directors/${id}`);
  return data;
}

export async function createDirector(payload: CreateDirectorPayload): Promise<AdminDirector> {
  const body = {
    fullName: payload.fullName.trim(),
    birthDate: payload.birthDate || null,
    awards: payload.awards || null,
    biography: payload.biography || null
  };
  const { data } = await api.post<AdminDirector>('/admin/directors', body);
  return data;
}

export async function updateDirector(id: number, payload: UpdateDirectorPayload): Promise<AdminDirector> {
  const body = {
    fullName: payload.fullName?.trim() ?? undefined,
    birthDate: payload.birthDate ?? undefined,
    awards: payload.awards ?? undefined,
    biography: payload.biography ?? undefined
  };
  const { data } = await api.put<AdminDirector>(`/admin/directors/${id}`, body);
  return data;
}

export async function deleteDirector(id: number): Promise<void> {
  await api.delete(`/admin/directors/${id}`);
}
