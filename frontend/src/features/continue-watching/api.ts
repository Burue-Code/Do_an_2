import { api } from '@/lib/axios';
import type { ContinueWatchingResponse } from './types';

export async function fetchContinueWatching(): Promise<ContinueWatchingResponse> {
  const { data } = await api.get<ContinueWatchingResponse>('/watch-history/me/continue-watching');
  return data;
}

