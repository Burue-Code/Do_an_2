import type { MovieCard } from '@/features/movie/types';

export interface RecommendationItem {
  movie: MovieCard;
  score: number;
}

export interface RecommendationResponse {
  items: RecommendationItem[];
}

