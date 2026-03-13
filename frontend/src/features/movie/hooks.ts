import { useQuery } from '@tanstack/react-query';
import { fetchMovies, fetchMovieById, type FetchMoviesParams } from './api';

export function useMovieList(params: FetchMoviesParams = {}) {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: () => fetchMovies(params)
  });
}

export function useMovieDetail(id: number | null, enabled = true) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieById(id!),
    enabled: enabled && id != null
  });
}
