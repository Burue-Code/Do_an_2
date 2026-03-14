import { api } from '@/lib/axios';
import type { MoviePageResponse } from '@/features/movie/types';

export interface FetchMyWatchlistParams {
  page?: number;
  size?: number;
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

