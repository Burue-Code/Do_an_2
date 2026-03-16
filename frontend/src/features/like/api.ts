import { api } from '@/lib/axios';
import type { ToggleLikeResponse } from './types';

export async function getLikeStatus(movieId: number): Promise<ToggleLikeResponse> {
  const { data } = await api.get<ToggleLikeResponse>(`/movies/${movieId}/like`);
  return data;
}

export async function toggleLike(movieId: number): Promise<ToggleLikeResponse> {
  const { data } = await api.post<ToggleLikeResponse>(`/movies/${movieId}/like/toggle`);
  return data;
}

