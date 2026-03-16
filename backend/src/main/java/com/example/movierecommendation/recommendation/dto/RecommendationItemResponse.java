package com.example.movierecommendation.recommendation.dto;

import com.example.movierecommendation.movie.dto.MovieListResponse;

public class RecommendationItemResponse {

    private MovieListResponse movie;
    private float score;

    public RecommendationItemResponse() {
    }

    public RecommendationItemResponse(MovieListResponse movie, float score) {
        this.movie = movie;
        this.score = score;
    }

    public MovieListResponse getMovie() {
        return movie;
    }

    public void setMovie(MovieListResponse movie) {
        this.movie = movie;
    }

    public float getScore() {
        return score;
    }

    public void setScore(float score) {
        this.score = score;
    }
}

