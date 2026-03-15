import { api } from '@/lib/axios';
import type { DashboardOverview, GenreStatistic, TrendingMovie } from './types';

export async function fetchOverview(): Promise<DashboardOverview> {
  const { data } = await api.get<DashboardOverview>('/admin/dashboard/overview');
  return data;
}

export async function fetchTrendingMovies(limit = 10): Promise<TrendingMovie[]> {
  const { data } = await api.get<TrendingMovie[]>('/admin/dashboard/trending-movies', {
    params: { limit }
  });
  return data;
}

export async function fetchGenreStatistics(): Promise<GenreStatistic[]> {
  const { data } = await api.get<GenreStatistic[]>('/admin/dashboard/genre-statistics');
  return data;
}

