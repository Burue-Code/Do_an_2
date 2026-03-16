package com.example.movierecommendation.dashboard.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.dashboard.dto.DashboardOverviewResponse;
import com.example.movierecommendation.dashboard.dto.GenreStatisticResponse;
import com.example.movierecommendation.dashboard.dto.TrendingMovieResponse;
import com.example.movierecommendation.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    public AdminDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/overview")
    public ResponseEntity<BaseResponse<DashboardOverviewResponse>> getOverview() {
        DashboardOverviewResponse response = dashboardService.getOverview();
        return ResponseEntity.ok(BaseResponse.ok(response));
    }

    @GetMapping("/trending-movies")
    public ResponseEntity<BaseResponse<List<TrendingMovieResponse>>> getTrendingMovies(
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        List<TrendingMovieResponse> items = dashboardService.getTrendingMovies(limit);
        return ResponseEntity.ok(BaseResponse.ok(items));
    }

    @GetMapping("/genre-statistics")
    public ResponseEntity<BaseResponse<List<GenreStatisticResponse>>> getGenreStatistics() {
        List<GenreStatisticResponse> stats = dashboardService.getGenreStatistics();
        return ResponseEntity.ok(BaseResponse.ok(stats));
    }
}

