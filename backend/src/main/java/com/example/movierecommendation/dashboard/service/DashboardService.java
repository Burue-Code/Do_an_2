package com.example.movierecommendation.dashboard.service;

import com.example.movierecommendation.dashboard.dto.DashboardOverviewResponse;
import com.example.movierecommendation.dashboard.dto.GenreStatisticResponse;
import com.example.movierecommendation.dashboard.dto.TrendingMovieResponse;

import java.util.List;

public interface DashboardService {

    DashboardOverviewResponse getOverview();

    List<TrendingMovieResponse> getTrendingMovies(int limit);

    List<GenreStatisticResponse> getGenreStatistics();
}

