import { useQuery } from '@tanstack/react-query';
import { fetchRecommendationsHome, fetchRecommendationsMe } from './api';
import type { RecommendationResponse } from './types';

const RECOMMENDATIONS_KEY = 'recommendations';

export function useRecommendationsMe(limit = 20) {
  return useQuery<RecommendationResponse>({
    queryKey: [RECOMMENDATIONS_KEY, 'me', { limit }],
    queryFn: () => fetchRecommendationsMe(limit)
  });
}

export function useRecommendationsHome(limit = 20) {
  return useQuery<RecommendationResponse>({
    queryKey: [RECOMMENDATIONS_KEY, 'home', { limit }],
    queryFn: () => fetchRecommendationsHome(limit)
  });
}

