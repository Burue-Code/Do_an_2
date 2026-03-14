package com.example.movierecommendation.rating.dto;

public class RatingSummaryResponse {

    private Float ratingScore;
    private Integer ratingCount;

    public RatingSummaryResponse() {
    }

    public RatingSummaryResponse(Float ratingScore, Integer ratingCount) {
        this.ratingScore = ratingScore;
        this.ratingCount = ratingCount;
    }

    public Float getRatingScore() {
        return ratingScore;
    }

    public void setRatingScore(Float ratingScore) {
        this.ratingScore = ratingScore;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }
}
