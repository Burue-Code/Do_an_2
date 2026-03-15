import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMyWatchlist, getWatchlistStatus, toggleWatchlist, type FetchMyWatchlistParams, type WatchlistStatusResponse } from './api';

const WATCHLIST_QUERY_KEY = ['watchlist', 'me'];

export function useMyWatchlist(params: FetchMyWatchlistParams = {}) {
  const { page = 0, size = 20 } = params;

  return useQuery({
    queryKey: [...WATCHLIST_QUERY_KEY, { page, size }],
    queryFn: () => fetchMyWatchlist({ page, size })
  });
}

const WATCHLIST_STATUS_KEY = 'watchlist-status';

export function useWatchlistStatus(movieId: number | null, enabled = true) {
  return useQuery<WatchlistStatusResponse>({
    queryKey: [WATCHLIST_STATUS_KEY, movieId],
    queryFn: () => getWatchlistStatus(movieId!),
    enabled: enabled && movieId != null
  });
}

export function useToggleWatchlist(movieId: number) {
  const queryClient = useQueryClient();
  return useMutation<WatchlistStatusResponse, Error, void>({
    mutationFn: () => toggleWatchlist(movieId),
    onSuccess: (data) => {
      queryClient.setQueryData<WatchlistStatusResponse>([WATCHLIST_STATUS_KEY, movieId], data);
      queryClient.invalidateQueries({ queryKey: WATCHLIST_QUERY_KEY });
    }
  });
}

