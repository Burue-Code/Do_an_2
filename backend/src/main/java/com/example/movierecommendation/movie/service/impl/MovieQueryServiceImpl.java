package com.example.movierecommendation.movie.service.impl;

import com.example.movierecommendation.genre.entity.Genre;
import com.example.movierecommendation.movie.dto.MovieDetailResponse;
import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.entity.MovieGenre;
import com.example.movierecommendation.movie.mapper.MovieMapper;
import com.example.movierecommendation.movie.repository.MovieGenreRepository;
import com.example.movierecommendation.movie.repository.MovieRepository;
import com.example.movierecommendation.movie.service.MovieQueryService;
import com.example.movierecommendation.movie.specification.MovieSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieQueryServiceImpl implements MovieQueryService {

    private final MovieRepository movieRepository;
    private final MovieGenreRepository movieGenreRepository;
    private final MovieMapper movieMapper;

    public MovieQueryServiceImpl(MovieRepository movieRepository,
                                 MovieGenreRepository movieGenreRepository,
                                 MovieMapper movieMapper) {
        this.movieRepository = movieRepository;
        this.movieGenreRepository = movieGenreRepository;
        this.movieMapper = movieMapper;
    }

    @Override
    public Page<MovieListResponse> searchMovies(String keyword, Long genreId, Pageable pageable) {
        Specification<Movie> spec = MovieSpecification.withFilters(keyword, genreId, null, null);
        Page<Movie> page = movieRepository.findAll(spec, pageable);
        return page.map(movieMapper::toListDto);
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

