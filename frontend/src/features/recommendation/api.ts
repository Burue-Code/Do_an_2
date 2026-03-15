import { api } from '@/lib/axios';
import type { RecommendationResponse } from './types';

export async function fetchRecommendationsMe(limit = 20): Promise<RecommendationResponse> {
  const { data } = await api.get<RecommendationResponse>('/recommendations/me', {
    params: { limit }
  });
  return data;
}

export async function fetchRecommendationsHome(limit = 20): Promise<RecommendationResponse> {
  const { data } = await api.get<RecommendationResponse>('/recommendations/home', {
    params: { limit }
  });
  return data;
}

