import { api } from '@/lib/axios';
import type { MovieCard } from '@/features/movie/types';

export interface PublicScheduleItem {
  movie: MovieCard;
  dayOfWeek: string;
  airTime: string;
  note: string | null;
}

export async function fetchSchedules(dayOfWeek?: string): Promise<PublicScheduleItem[]> {
  const { data } = await api.get<PublicScheduleItem[]>('/schedules', {
    params: dayOfWeek ? { dayOfWeek } : undefined
  });
  return data ?? [];
}

