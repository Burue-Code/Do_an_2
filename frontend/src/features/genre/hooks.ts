import { useQuery } from '@tanstack/react-query';
import { fetchGenres } from './api';

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres
  });
}
