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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

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
    public Page<MovieListResponse> searchMovies(String keyword, Long genreId, Integer movieType, String sort, Pageable pageable) {
        Pageable withSort = pageable;
        if (StringUtils.hasText(sort)) {
            if ("top".equalsIgnoreCase(sort)) {
                withSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "ratingScore"));
            } else if ("new".equalsIgnoreCase(sort)) {
                withSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "createdAt"));
            }
        }
        Page<Movie> page;
        if (movieType != null && !StringUtils.hasText(keyword) && genreId == null) {
            page = movieRepository.findByMovieType(movieType, withSort);
        } else {
            Specification<Movie> spec = MovieSpecification.withFilters(keyword, genreId, null, movieType);
            page = movieRepository.findAll(spec, withSort);
        }
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

    @Override
    public List<MovieListResponse> getTopRated(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return movieRepository.findAllByOrderByRatingScoreDesc(pageable).stream()
                .map(movieMapper::toListDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovieListResponse> getNewest(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return movieRepository.findAllByOrderByCreatedAtDesc(pageable).stream()
                .map(movieMapper::toListDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovieListResponse> getTrending(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return movieRepository.findAllByOrderByRatingCountDesc(pageable).stream()
                .map(movieMapper::toListDto)
                .collect(Collectors.toList());
    }
}

