package com.example.movierecommendation.movie.mapper;

import com.example.movierecommendation.genre.entity.Genre;
import com.example.movierecommendation.movie.dto.MovieDetailResponse;
import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.movie.entity.Movie;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MovieMapper {

    public MovieListResponse toListDto(Movie movie) {
        if (movie == null) {
            return null;
        }
        MovieListResponse dto = new MovieListResponse();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setPoster(movie.getPoster());
        dto.setRatingScore(movie.getRatingScore());
        dto.setRatingCount(movie.getRatingCount());
        dto.setStatus(movie.getStatus());
        dto.setMovieType(movie.getMovieType());
        return dto;
    }

    public MovieDetailResponse toDetailDto(Movie movie, List<Genre> genres) {
        if (movie == null) {
            return null;
        }
        MovieDetailResponse dto = new MovieDetailResponse();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setDescription(movie.getDescription());
        dto.setReleaseYear(movie.getReleaseYear());
        dto.setPoster(movie.getPoster());
        dto.setDuration(movie.getDuration());
        dto.setStatus(movie.getStatus());
        dto.setTotalEpisodes(movie.getTotalEpisodes());
        dto.setRatingScore(movie.getRatingScore());
        dto.setRatingCount(movie.getRatingCount());
        dto.setMovieType(movie.getMovieType());
        if (genres != null) {
            dto.setGenres(genres.stream().map(Genre::getName).collect(Collectors.toList()));
        }
        return dto;
    }
}

