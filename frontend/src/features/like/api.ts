import { api } from '@/lib/axios';
import type { ToggleLikeResponse } from './types';

export async function toggleLike(movieId: number): Promise<ToggleLikeResponse> {
  const { data } = await api.post<ToggleLikeResponse>(`/movies/${movieId}/like/toggle`);
  return data;
}

