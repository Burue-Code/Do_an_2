import { api } from '@/lib/axios';
import type { RatingSummary } from './types';

export async function rateMovie(
  movieId: number,
  ratingValue: number
): Promise<RatingSummary> {
  const { data } = await api.post<RatingSummary>(`/movies/${movieId}/ratings`, {
    ratingValue
  });
  return data;
}

