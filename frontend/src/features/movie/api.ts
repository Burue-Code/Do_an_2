import { api } from '@/lib/axios';
import type { MovieCard, MovieDetail, MoviePageResponse } from './types';

export interface FetchMoviesParams {
  page?: number;
  size?: number;
  keyword?: string;
  genreId?: number;
  /** 1 = phim lẻ, 2 = phim bộ */
  movieType?: number;
  /** "top" = đánh giá cao, "new" = mới cập nhật */
  sort?: 'top' | 'new';
}

export async function fetchMovies(
  params: FetchMoviesParams = {}
): Promise<MoviePageResponse> {
  const { page = 0, size = 20, keyword, genreId, movieType, sort } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('size', String(size));
  if (keyword) searchParams.set('keyword', keyword);
  if (genreId != null) searchParams.set('genreId', String(genreId));
  if (movieType != null) searchParams.set('movieType', String(movieType));
  if (sort) searchParams.set('sort', sort);

  const { data } = await api.get<MoviePageResponse>(
    `/movies?${searchParams.toString()}`
  );
  return data;
}

export async function fetchMovieById(id: number): Promise<MovieDetail> {
  const { data } = await api.get<MovieDetail>(`/movies/${id}`);
  return data;
}

export async function fetchTrending(limit = 10): Promise<MovieCard[]> {
  const { data } = await api.get<MovieCard[]>('/movies/trending', { params: { limit } });
  return data;
}

export async function fetchTop(limit = 10): Promise<MovieCard[]> {
  const { data } = await api.get<MovieCard[]>('/movies/top', { params: { limit } });
  return data;
}

export async function fetchNewReleases(limit = 10): Promise<MovieCard[]> {
  const { data } = await api.get<MovieCard[]>('/movies/new', { params: { limit } });
  return data;
}

export interface EpisodeItem {
  id: number;
  episodeNumber: number;
  videoUrl: string;
  releaseTime: string | null;
}

export async function fetchMovieEpisodes(movieId: number): Promise<EpisodeItem[]> {
  const { data } = await api.get<EpisodeItem[]>(`/movies/${movieId}/episodes`);
  return data ?? [];
}

export interface CastMember {
  id: number;
  fullName: string;
  characterName: string | null;
}

export interface MovieCast {
  actors: CastMember[];
  directors: CastMember[];
}

export async function fetchMovieCast(movieId: number): Promise<MovieCast> {
  const { data } = await api.get<MovieCast>(`/movies/${movieId}/cast`);
  return data ?? { actors: [], directors: [] };
}
