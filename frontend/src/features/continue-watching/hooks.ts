import { useQuery } from '@tanstack/react-query';
import { fetchContinueWatching } from './api';

export function useContinueWatching(options?: { enabled?: boolean; limit?: number }) {
  const { enabled = true, limit = 10 } = options ?? {};
  return useQuery({
    queryKey: ['continue-watching', 'me', limit],
    queryFn: () => fetchContinueWatching(limit),
    enabled
  });
}

