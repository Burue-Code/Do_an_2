import { useQuery } from '@tanstack/react-query';
import { fetchGenreStatistics, fetchOverview, fetchTrendingMovies } from './api';
import type { DashboardOverview, GenreStatistic, TrendingMovie } from './types';

const DASHBOARD_KEY = 'admin-dashboard';

export function useDashboardOverview() {
  return useQuery<DashboardOverview>({
    queryKey: [DASHBOARD_KEY, 'overview'],
    queryFn: fetchOverview
  });
}

export function useTrendingMovies(limit = 10) {
  return useQuery<TrendingMovie[]>({
    queryKey: [DASHBOARD_KEY, 'trending', { limit }],
    queryFn: () => fetchTrendingMovies(limit)
  });
}

export function useGenreStatistics() {
  return useQuery<GenreStatistic[]>({
    queryKey: [DASHBOARD_KEY, 'genres'],
    queryFn: fetchGenreStatistics
  });
}

