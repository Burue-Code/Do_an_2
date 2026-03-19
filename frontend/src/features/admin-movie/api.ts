import { api } from '@/lib/axios';
import type { EpisodeItem } from '@/features/movie/api';

export interface AdminMoviePayload {
  title: string;
  description?: string | null;
  releaseYear?: number | null;
  duration?: number | null;
  status?: string | null;
  totalEpisodes?: number | null;
  movieType?: number | null;
  poster?: string | null;
  genreIds?: number[] | null;
  actorIds?: number[] | null;
  directorIds?: number[] | null;
}

export interface AdminMovieStats {
  likesCount: number;
  commentsCount: number;
  ratingsCount: number;
  averageRating: number;
  watchLogsCount: number;
  completedViewsCount: number;
}

export interface AdminEpisodePayload {
  episodeNumber: number;
  videoUrl: string;
  releaseTime?: string | null;
}

export interface AdminSchedulePayload {
  dayOfWeek: string;
  airTime: string;
  note?: string | null;
}

export async function createMovie(payload: AdminMoviePayload): Promise<number> {
  const { data } = await api.post<number>('/admin/movies', payload);
  return data;
}

export async function updateMovie(id: number, payload: AdminMoviePayload): Promise<void> {
  await api.put(`/admin/movies/${id}`, payload);
}

export async function deleteMovie(id: number): Promise<void> {
  await api.delete(`/admin/movies/${id}`);
}

export async function fetchAdminEpisodes(movieId: number): Promise<EpisodeItem[]> {
  const { data } = await api.get<EpisodeItem[]>(`/admin/movies/${movieId}/episodes`);
  return data ?? [];
}

export async function createEpisode(movieId: number, payload: AdminEpisodePayload): Promise<void> {
  await api.post(`/admin/movies/${movieId}/episodes`, payload);
}

export async function updateEpisode(episodeId: number, payload: AdminEpisodePayload): Promise<void> {
  await api.put(`/admin/movies/episodes/${episodeId}`, payload);
}

export async function deleteEpisode(episodeId: number): Promise<void> {
  await api.delete(`/admin/movies/episodes/${episodeId}`);
}

export interface ScheduleItem {
  id: number;
  dayOfWeek: string;
  airTime: string;
  note: string | null;
}

export async function fetchSchedules(movieId: number): Promise<ScheduleItem[]> {
  const { data } = await api.get<ScheduleItem[]>(`/admin/movies/${movieId}/schedules`);
  return data ?? [];
}

export async function createSchedule(movieId: number, payload: AdminSchedulePayload): Promise<void> {
  await api.post(`/admin/movies/${movieId}/schedules`, payload);
}

export async function updateSchedule(scheduleId: number, payload: AdminSchedulePayload): Promise<void> {
  await api.put(`/admin/movies/schedules/${scheduleId}`, payload);
}

export async function deleteSchedule(scheduleId: number): Promise<void> {
  await api.delete(`/admin/movies/schedules/${scheduleId}`);
}

export async function fetchAdminMovieStats(id: number): Promise<AdminMovieStats> {
  const { data } = await api.get<AdminMovieStats>(`/admin/movies/${id}/stats`);
  return data;
}

export interface SimplePerson {
  id: number;
  fullName: string;
}

export async function searchActors(keyword: string): Promise<SimplePerson[]> {
  if (!keyword.trim()) return [];
  try {
    const { data } = await api.get<SimplePerson[]>('/admin/cast/actors', {
      params: { keyword: keyword.trim() }
    });
    return data;
  } catch {
    // Nếu không có quyền (401/403) hoặc lỗi khác thì không gợi ý gì, tránh làm vỡ UI
    return [];
  }
}

export async function searchDirectors(keyword: string): Promise<SimplePerson[]> {
  if (!keyword.trim()) return [];
  try {
    const { data } = await api.get<SimplePerson[]>('/admin/cast/directors', {
      params: { keyword: keyword.trim() }
    });
    return data;
  } catch {
    return [];
  }
}

