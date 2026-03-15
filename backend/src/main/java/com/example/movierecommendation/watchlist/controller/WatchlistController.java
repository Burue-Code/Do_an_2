package com.example.movierecommendation.watchlist.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.common.dto.PageResponse;
import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.watchlist.dto.WatchlistToggleResponse;
import com.example.movierecommendation.watchlist.service.WatchlistService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping("/api/movies/{movieId}/watchlist")
    public ResponseEntity<BaseResponse<WatchlistToggleResponse>> getStatus(@PathVariable Long movieId) {
        boolean inWatchlist = watchlistService.isInWatchlist(movieId);
        return ResponseEntity.ok(BaseResponse.ok(new WatchlistToggleResponse(inWatchlist)));
    }

    @PostMapping("/api/movies/{movieId}/watchlist/toggle")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<WatchlistToggleResponse>> toggle(
            @PathVariable Long movieId) {
        WatchlistToggleResponse response = watchlistService.toggle(movieId);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }

    @GetMapping("/api/users/me/watchlist")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<PageResponse<MovieListResponse>>> getMyWatchlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieListResponse> result = watchlistService.getCurrentUserWatchlist(pageable);
        return ResponseEntity.ok(BaseResponse.ok(PageResponse.of(result)));
    }
}

