package com.example.movierecommendation.recommendation.dto;

import java.util.List;

public class RecommendationResponse {

    private List<RecommendationItemResponse> items;

    public RecommendationResponse() {
    }

    public RecommendationResponse(List<RecommendationItemResponse> items) {
        this.items = items;
    }

    public List<RecommendationItemResponse> getItems() {
        return items;
    }

    public void setItems(List<RecommendationItemResponse> items) {
        this.items = items;
    }
}

