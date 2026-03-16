import { api } from '@/lib/axios';

export interface SaveWatchLogPayload {
  movieId: number;
  episodeId?: number | null;
  durationWatched: number;
  completed?: boolean;
}

export async function saveWatchLog(payload: SaveWatchLogPayload): Promise<void> {
  await api.post('/users/me/watch-logs', payload);
}

