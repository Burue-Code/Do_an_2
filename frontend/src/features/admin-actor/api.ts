import { api } from '@/lib/axios';
import type { AdminActor, CreateActorPayload, UpdateActorPayload } from './types';

export async function fetchAdminActors(): Promise<AdminActor[]> {
  const { data } = await api.get<AdminActor[]>('/admin/actors');
  return data;
}

export async function fetchAdminActor(id: number): Promise<AdminActor> {
  const { data } = await api.get<AdminActor>(`/admin/actors/${id}`);
  return data;
}

export async function createActor(payload: CreateActorPayload): Promise<AdminActor> {
  const body = {
    fullName: payload.fullName.trim(),
    gender: payload.gender || null,
    birthDate: payload.birthDate || null,
    nationality: payload.nationality || null,
    biography: payload.biography || null,
    imageUrl: payload.imageUrl || null
  };
  const { data } = await api.post<AdminActor>('/admin/actors', body);
  return data;
}

export async function updateActor(id: number, payload: UpdateActorPayload): Promise<AdminActor> {
  const body = {
    fullName: payload.fullName?.trim() ?? undefined,
    gender: payload.gender ?? undefined,
    birthDate: payload.birthDate ?? undefined,
    nationality: payload.nationality ?? undefined,
    biography: payload.biography ?? undefined,
    imageUrl: payload.imageUrl ?? undefined
  };
  const { data } = await api.put<AdminActor>(`/admin/actors/${id}`, body);
  return data;
}

export async function deleteActor(id: number): Promise<void> {
  await api.delete(`/admin/actors/${id}`);
}
