package com.example.movierecommendation.recommendation.service;

import com.example.movierecommendation.recommendation.dto.RecommendationItemResponse;

import java.util.List;

public interface RecommendationService {

    List<RecommendationItemResponse> getRecommendationsForUser(Long userId, int limit);

    List<RecommendationItemResponse> getHomeRecommendations(Long userIdOrNull, int limit);
}

