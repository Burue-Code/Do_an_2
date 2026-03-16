import { api } from '@/lib/axios';
import type { Genre } from '@/features/genre/types';

export interface CreateGenrePayload {
  name: string;
}

export interface UpdateGenrePayload {
  name: string;
}

export async function createGenre(payload: CreateGenrePayload): Promise<Genre> {
  const { data } = await api.post<Genre>('/admin/genres', {
    name: payload.name
  });
  return data;
}

export async function updateGenre(id: number, payload: UpdateGenrePayload): Promise<Genre> {
  const { data } = await api.put<Genre>(`/admin/genres/${id}`, {
    name: payload.name
  });
  return data;
}

export async function deleteGenre(id: number): Promise<void> {
  await api.delete<void>(`/admin/genres/${id}`);
}

