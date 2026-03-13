package com.example.movierecommendation.movie.service.impl;

import com.example.movierecommendation.genre.entity.Genre;
import com.example.movierecommendation.genre.repository.GenreRepository;
import com.example.movierecommendation.movie.dto.MovieDetailResponse;
import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.entity.MovieGenre;
import com.example.movierecommendation.movie.mapper.MovieMapper;
import com.example.movierecommendation.movie.repository.MovieGenreRepository;
import com.example.movierecommendation.movie.repository.MovieRepository;
import com.example.movierecommendation.movie.service.MovieQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieQueryServiceImpl implements MovieQueryService {

    private final MovieRepository movieRepository;
    private final MovieGenreRepository movieGenreRepository;
    private final GenreRepository genreRepository;
    private final MovieMapper movieMapper;

    public MovieQueryServiceImpl(MovieRepository movieRepository,
                                 MovieGenreRepository movieGenreRepository,
                                 GenreRepository genreRepository,
                                 MovieMapper movieMapper) {
        this.movieRepository = movieRepository;
        this.movieGenreRepository = movieGenreRepository;
        this.genreRepository = genreRepository;
        this.movieMapper = movieMapper;
    }

    @Override
    public Page<MovieListResponse> searchMovies(String keyword, Long genreId, Pageable pageable) {
        Page<Movie> page = movieRepository.findAll(pageable);

        List<Movie> filtered = page.getContent().stream()
                .filter(movie -> {
                    if (StringUtils.hasText(keyword)) {
                        return movie.getTitle() != null &&
                                movie.getTitle().toLowerCase().contains(keyword.toLowerCase());
                    }
                    return true;
                })
                .filter(movie -> {
                    if (genreId != null) {
                        List<MovieGenre> mg = movieGenreRepository.findByMovie(movie);
                        return mg.stream().anyMatch(it -> it.getGenre() != null &&
                                genreId.equals(it.getGenre().getId()));
                    }
                    return true;
                })
                .toList();

        List<MovieListResponse> dtos = filtered.stream()
                .map(movieMapper::toListDto)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    @Override
    public MovieDetailResponse getMovieDetail(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        List<MovieGenre> movieGenres = movieGenreRepository.findByMovie(movie);
        List<Genre> genres = movieGenres.stream()
                .map(MovieGenre::getGenre)
                .collect(Collectors.toList());

        return movieMapper.toDetailDto(movie, genres);
    }
}

