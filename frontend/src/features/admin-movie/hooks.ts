import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type {
  AdminMoviePayload,
  SimplePerson,
  AdminMovieStats,
  AdminEpisodePayload,
  AdminSchedulePayload,
  ScheduleItem
} from './api';

const MOVIE_LIST_KEY_PREFIX = ['movies', 'list'] as const;

export function useCreateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminMoviePayload) => api.createMovie(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOVIE_LIST_KEY_PREFIX });
    }
  });
}

export function useUpdateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: number; payload: AdminMoviePayload }) =>
      api.updateMovie(params.id, params.payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: MOVIE_LIST_KEY_PREFIX });
      if (variables.id != null) {
        queryClient.invalidateQueries({ queryKey: ['movie', variables.id] });
      }
    }
  });
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOVIE_LIST_KEY_PREFIX });
    }
  });
}

export function useActorSuggestions() {
  return {
    search: (keyword: string) => api.searchActors(keyword)
  };
}

export function useDirectorSuggestions() {
  return {
    search: (keyword: string) => api.searchDirectors(keyword)
  };
}

export function useAdminMovieStats(id: number | null) {
  return useQuery<AdminMovieStats>({
    queryKey: ['admin', 'movies', id, 'stats'],
    queryFn: () => api.fetchAdminMovieStats(id as number),
    enabled: id != null
  });
}

export function useAdminEpisodes(movieId: number | null) {
  return useQuery({
    queryKey: ['admin', 'movies', movieId, 'episodes'],
    queryFn: () => api.fetchAdminEpisodes(movieId as number),
    enabled: movieId != null
  });
}

export function useSchedules(movieId: number | null) {
  return useQuery<ScheduleItem[]>({
    queryKey: ['admin', 'movies', movieId, 'schedules'],
    queryFn: () => api.fetchSchedules(movieId as number),
    enabled: movieId != null
  });
}

export function useCreateEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { movieId: number; payload: AdminEpisodePayload }) =>
      api.createEpisode(params.movieId, params.payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'movies', variables.movieId, 'episodes']
      });
    }
  });
}

export function useUpdateEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { movieId: number; episodeId: number; payload: AdminEpisodePayload }) =>
      api.updateEpisode(params.episodeId, params.payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'movies', variables.movieId, 'episodes']
      });
    }
  });
}

export function useDeleteEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { movieId: number; episodeId: number }) =>
      api.deleteEpisode(params.episodeId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'movies', variables.movieId, 'episodes']
      });
    }
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { movieId: number; payload: AdminSchedulePayload }) =>
      api.createSchedule(params.movieId, params.payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'movies', variables.movieId, 'schedules']
      });
    }
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { movieId: number; scheduleId: number; payload: AdminSchedulePayload }) =>
      api.updateSchedule(params.scheduleId, params.payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'movies', variables.movieId, 'schedules']
      });
    }
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { movieId: number; scheduleId: number }) =>
      api.deleteSchedule(params.scheduleId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'movies', variables.movieId, 'schedules']
      });
    }
  });
}

