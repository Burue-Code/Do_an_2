package com.example.movierecommendation.rating.service;

import com.example.movierecommendation.rating.dto.RateMovieRequest;
import com.example.movierecommendation.rating.dto.RatingSummaryResponse;

public interface RatingService {

    RatingSummaryResponse rateMovie(Long movieId, RateMovieRequest request);

    RatingSummaryResponse getSummary(Long movieId);
}
