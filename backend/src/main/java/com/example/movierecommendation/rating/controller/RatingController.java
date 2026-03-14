package com.example.movierecommendation.rating.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.rating.dto.RateMovieRequest;
import com.example.movierecommendation.rating.dto.RatingSummaryResponse;
import com.example.movierecommendation.rating.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies/{movieId}/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<RatingSummaryResponse>> rateMovie(
            @PathVariable Long movieId,
            @Valid @RequestBody RateMovieRequest request) {
        RatingSummaryResponse response = ratingService.rateMovie(movieId, request);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }

    @GetMapping("/summary")
    public ResponseEntity<BaseResponse<RatingSummaryResponse>> getSummary(@PathVariable Long movieId) {
        RatingSummaryResponse response = ratingService.getSummary(movieId);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }
}
