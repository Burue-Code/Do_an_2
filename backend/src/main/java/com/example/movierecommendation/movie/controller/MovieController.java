package com.example.movierecommendation.movie.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.common.dto.PageResponse;
import com.example.movierecommendation.movie.dto.MovieDetailResponse;
import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.movie.service.MovieQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieQueryService movieQueryService;

    public MovieController(MovieQueryService movieQueryService) {
        this.movieQueryService = movieQueryService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<PageResponse<MovieListResponse>>> getMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long genreId
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieListResponse> result = movieQueryService.searchMovies(keyword, genreId, pageable);
        return ResponseEntity.ok(BaseResponse.ok(PageResponse.of(result)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<MovieDetailResponse>> getMovieDetail(@PathVariable Long id) {
        MovieDetailResponse response = movieQueryService.getMovieDetail(id);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }
}

