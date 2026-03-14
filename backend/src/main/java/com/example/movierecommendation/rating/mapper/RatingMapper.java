package com.example.movierecommendation.rating.mapper;

import com.example.movierecommendation.rating.dto.RatingSummaryResponse;

public final class RatingMapper {

    private RatingMapper() {
    }

    public static RatingSummaryResponse toSummary(Float ratingScore, Integer ratingCount) {
        return new RatingSummaryResponse(
                ratingScore != null ? ratingScore : 0f,
                ratingCount != null ? ratingCount : 0
        );
    }
}
