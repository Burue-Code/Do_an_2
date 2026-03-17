import { api } from '@/lib/axios';

export interface AdminScheduleItem {
  id: number;
  movieId: number;
  movieTitle: string;
  dayOfWeek: string;
  airTime: string;
  note?: string | null;
}

export interface AdminSchedulePayload {
  movieId: number;
  dayOfWeek: string;
  airTime: string;
  note?: string | null;
}

export async function fetchAdminSchedules(): Promise<AdminScheduleItem[]> {
  const res = await api.get('/admin/schedules');
  // interceptor đã unwrap BaseResponse -> res.data chính là List<AdminScheduleResponse>
  return (res.data as AdminScheduleItem[]) ?? [];
}

export async function createAdminSchedule(payload: AdminSchedulePayload): Promise<AdminScheduleItem> {
  const res = await api.post('/admin/schedules', payload);
  return res.data as AdminScheduleItem;
}

export async function updateAdminSchedule(
  id: number,
  payload: AdminSchedulePayload
): Promise<AdminScheduleItem> {
  const res = await api.put(`/admin/schedules/${id}`, payload);
  return res.data as AdminScheduleItem;
}

export async function deleteAdminSchedule(id: number): Promise<void> {
  await api.delete(`/admin/schedules/${id}`);
}

export interface MovieSuggestion {
  id: number;
  title: string;
}

export async function searchMovieSuggestions(keyword: string): Promise<MovieSuggestion[]> {
  const q = keyword.trim();
  if (!q) return [];
  try {
    const res = await api.get('/movies', {
      params: { page: 0, size: 10, keyword: q }
    });
    // axios interceptor đã unwrap BaseResponse => res.data chính là PageResponse
    const page: any = res.data;
    const items: any[] = page?.content ?? [];
    return items.map((m) => ({
      id: m.id,
      title: m.title
    }));
  } catch {
    return [];
  }
}

