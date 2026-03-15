import { useQuery } from '@tanstack/react-query';
import {
  fetchMovies,
  fetchMovieById,
  fetchTrending,
  fetchTop,
  fetchNewReleases,
  fetchMovieEpisodes,
  fetchMovieCast,
  type FetchMoviesParams
} from './api';

export function useMovieList(params: FetchMoviesParams = {}) {
  const { page = 0, size = 20, keyword, genreId, movieType, sort } = params;
  return useQuery({
    queryKey: ['movies', 'list', page, size, keyword ?? '', genreId ?? '', movieType ?? '', sort ?? ''],
    queryFn: () => fetchMovies(params),
    staleTime: 0,
    refetchOnMount: 'always'
  });
}

export function useMovieDetail(id: number | null, enabled = true) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieById(id!),
    enabled: enabled && id != null
  });
}

export function useTrending(limit = 10) {
  return useQuery({
    queryKey: ['movies', 'trending', limit],
    queryFn: () => fetchTrending(limit)
  });
}

export function useTop(limit = 10) {
  return useQuery({
    queryKey: ['movies', 'top', limit],
    queryFn: () => fetchTop(limit)
  });
}

export function useNewReleases(limit = 10) {
  return useQuery({
    queryKey: ['movies', 'new', limit],
    queryFn: () => fetchNewReleases(limit)
  });
}

export function useMovieEpisodes(movieId: number | null, enabled = true) {
  return useQuery({
    queryKey: ['movie', movieId, 'episodes'],
    queryFn: () => fetchMovieEpisodes(movieId!),
    enabled: enabled && movieId != null
  });
}

export function useMovieCast(movieId: number | null, enabled = true) {
  return useQuery({
    queryKey: ['movie', movieId, 'cast'],
    queryFn: () => fetchMovieCast(movieId!),
    enabled: enabled && movieId != null
  });
}
