package com.example.movierecommendation.movie.service;

import com.example.movierecommendation.movie.dto.MovieDetailResponse;
import com.example.movierecommendation.movie.dto.MovieListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MovieQueryService {

    Page<MovieListResponse> searchMovies(String keyword, Long genreId, Pageable pageable);

    MovieDetailResponse getMovieDetail(Long id);
}

