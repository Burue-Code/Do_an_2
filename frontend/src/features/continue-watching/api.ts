import { api } from '@/lib/axios';
import type { ContinueWatchingResponse } from './types';

export async function fetchContinueWatching(limit = 10): Promise<ContinueWatchingResponse> {
  const { data } = await api.get<ContinueWatchingResponse>('/users/me/continue-watching', {
    params: { limit }
  });
  return data;
}

