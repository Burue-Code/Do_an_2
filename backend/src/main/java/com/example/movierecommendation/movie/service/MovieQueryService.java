package com.example.movierecommendation.movie.service;

import com.example.movierecommendation.movie.dto.MovieDetailResponse;
import com.example.movierecommendation.movie.dto.MovieListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MovieQueryService {

    Page<MovieListResponse> searchMovies(String keyword, Long genreId, Integer movieType, String sort, Pageable pageable);

    MovieDetailResponse getMovieDetail(Long id);

    List<MovieListResponse> getTopRated(int limit);

    List<MovieListResponse> getNewest(int limit);

    List<MovieListResponse> getTrending(int limit);
}

