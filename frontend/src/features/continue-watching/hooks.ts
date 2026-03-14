import { useQuery } from '@tanstack/react-query';
import { fetchContinueWatching } from './api';

export function useContinueWatching() {
  return useQuery({
    queryKey: ['continue-watching', 'me'],
    queryFn: fetchContinueWatching
  });
}

