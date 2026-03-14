import { useQuery } from '@tanstack/react-query';
import { fetchMyWatchlist, type FetchMyWatchlistParams } from './api';

const WATCHLIST_QUERY_KEY = ['watchlist', 'me'];

export function useMyWatchlist(params: FetchMyWatchlistParams = {}) {
  const { page = 0, size = 20 } = params;

  return useQuery({
    queryKey: [...WATCHLIST_QUERY_KEY, { page, size }],
    queryFn: () => fetchMyWatchlist({ page, size })
  });
}

