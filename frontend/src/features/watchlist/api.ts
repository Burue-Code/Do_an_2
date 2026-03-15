import { api } from '@/lib/axios';
import type { MoviePageResponse } from '@/features/movie/types';

export interface WatchlistStatusResponse {
  inWatchlist: boolean;
}

export interface FetchMyWatchlistParams {
  page?: number;
  size?: number;
}

export async function getWatchlistStatus(movieId: number): Promise<WatchlistStatusResponse> {
  const { data } = await api.get<WatchlistStatusResponse>(`/movies/${movieId}/watchlist`);
  return data;
}

export async function toggleWatchlist(movieId: number): Promise<WatchlistStatusResponse> {
  const { data } = await api.post<WatchlistStatusResponse>(`/movies/${movieId}/watchlist/toggle`);
  return data;
}

export async function fetchMyWatchlist(
  params: FetchMyWatchlistParams = {}
): Promise<MoviePageResponse> {
  const { page = 0, size = 20 } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('size', String(size));

  const { data } = await api.get<MoviePageResponse>(
    `/users/me/watchlist?${searchParams.toString()}`
  );
  return data;
}

