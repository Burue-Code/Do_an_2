package com.example.movierecommendation.watchlist.service;

import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.watchlist.dto.WatchlistToggleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WatchlistService {

    WatchlistToggleResponse toggle(Long movieId);

    boolean isInWatchlist(Long movieId);

    Page<MovieListResponse> getCurrentUserWatchlist(Pageable pageable);
}

