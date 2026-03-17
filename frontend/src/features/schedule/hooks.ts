import { useQuery } from '@tanstack/react-query';
import { fetchSchedules } from './api';

export function useSchedules(dayOfWeek?: string) {
  return useQuery({
    queryKey: ['schedules', dayOfWeek ?? 'all'],
    queryFn: () => fetchSchedules(dayOfWeek)
  });
}

