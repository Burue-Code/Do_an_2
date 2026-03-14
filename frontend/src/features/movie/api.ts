import { api } from '@/lib/axios';
import type { MovieDetail, MoviePageResponse } from './types';

export interface FetchMoviesParams {
  page?: number;
  size?: number;
  keyword?: string;
  genreId?: number;
}

export async function fetchMovies(
  params: FetchMoviesParams = {}
): Promise<MoviePageResponse> {
  const { page = 0, size = 20, keyword, genreId } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('size', String(size));
  if (keyword) searchParams.set('keyword', keyword);
  if (genreId != null) searchParams.set('genreId', String(genreId));

  const { data } = await api.get<MoviePageResponse>(
    `/movies?${searchParams.toString()}`
  );
  return data;
}

export async function fetchMovieById(id: number): Promise<MovieDetail> {
  const { data } = await api.get<MovieDetail>(`/movies/${id}`);
  return data;
}
