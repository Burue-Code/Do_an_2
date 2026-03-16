import type { MovieCard } from '@/features/movie/types';

export interface ContinueWatchingItem {
  movie: MovieCard;
  progressPercent?: number | null;
  episodeNumber?: number | null;
}

export interface ContinueWatchingResponse {
  items: ContinueWatchingItem[];
}

