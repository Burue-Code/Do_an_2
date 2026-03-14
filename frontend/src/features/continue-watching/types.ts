import type { MovieCard } from '@/features/movie/types';

export interface ContinueWatchingItem extends MovieCard {
  episodeNumber?: number | null;
  progressPercent?: number | null;
}

export interface ContinueWatchingResponse {
  items: ContinueWatchingItem[];
}

