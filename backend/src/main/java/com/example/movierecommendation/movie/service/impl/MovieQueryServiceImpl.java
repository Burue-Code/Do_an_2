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
import com.example.movierecommendation.watchhistory.repository.WatchLogRepository;
import com.example.movierecommendation.like.repository.MovieLikeRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieQueryServiceImpl implements MovieQueryService {

    private static final int MAX_GENRES_TO_USE = 5;
    private static final int MAX_WATCHED_TO_ANALYSE = 80;
    private static final int MAX_LIKES_TO_ANALYSE = 80;
    private static final double DECAY_LAMBDA_PER_DAY = Math.log(2) / 14.0; // half-life ~14 ngày
    private static final double LIKE_BASE_WEIGHT = 2.0;
    private static final double WATCH_BASE_WEIGHT = 1.0;

    private final MovieRepository movieRepository;
    private final MovieGenreRepository movieGenreRepository;
    private final MovieMapper movieMapper;
    private final MovieLikeRepository movieLikeRepository;
    private final WatchLogRepository watchLogRepository;

    public MovieQueryServiceImpl(MovieRepository movieRepository,
                                 MovieGenreRepository movieGenreRepository,
                                 MovieMapper movieMapper,
                                 MovieLikeRepository movieLikeRepository,
                                 WatchLogRepository watchLogRepository) {
        this.movieRepository = movieRepository;
        this.movieGenreRepository = movieGenreRepository;
        this.movieMapper = movieMapper;
        this.movieLikeRepository = movieLikeRepository;
        this.watchLogRepository = watchLogRepository;
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

    @Override
    public List<MovieListResponse> getTrendingPersonalized(Long userId, int limit) {
        if (userId == null) {
            return getTrending(limit);
        }

        LocalDateTime now = LocalDateTime.now();

        var likes = movieLikeRepository.findById_UserId(userId).stream()
                .sorted(Comparator.comparing((com.example.movierecommendation.like.entity.MovieLike ml) -> {
                    LocalDateTime t = ml.getCreatedAt();
                    return t == null ? LocalDateTime.MIN : t;
                }).reversed())
                .limit(MAX_LIKES_TO_ANALYSE)
                .toList();

        var watchLogs = watchLogRepository
                .findByUser_IdOrderByLastWatchedAtDesc(userId, PageRequest.of(0, MAX_WATCHED_TO_ANALYSE));

        Set<Long> excludeMovieIds = new HashSet<>();
        likes.forEach(ml -> excludeMovieIds.add(ml.getMovie().getId()));
        watchLogs.forEach(wl -> excludeMovieIds.add(wl.getMovie().getId()));

        Map<Long, Double> movieWeights = new HashMap<>();
        for (var ml : likes) {
            Long movieId = ml.getMovie().getId();
            double w = LIKE_BASE_WEIGHT * decayWeight(ml.getCreatedAt(), now);
            movieWeights.merge(movieId, w, Double::sum);
        }
        for (var wl : watchLogs) {
            Long movieId = wl.getMovie().getId();
            double w = WATCH_BASE_WEIGHT * decayWeight(wl.getLastWatchedAt(), now);
            if (Boolean.TRUE.equals(wl.getCompleted())) {
                w *= 1.2;
            }
            movieWeights.merge(movieId, w, Double::sum);
        }

        if (movieWeights.isEmpty()) {
            return getTrending(limit);
        }

        List<Long> sourceMovieIds = new ArrayList<>(movieWeights.keySet());
        List<MovieGenre> movieGenres = movieGenreRepository.findByMovie_IdIn(sourceMovieIds);
        Map<Long, Double> genreScore = new HashMap<>();
        for (var mg : movieGenres) {
            Double mw = movieWeights.get(mg.getMovie().getId());
            if (mw == null) continue;
            genreScore.merge(mg.getGenre().getId(), mw, Double::sum);
        }

        List<Long> preferredGenreIds = genreScore.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(MAX_GENRES_TO_USE)
                .map(Map.Entry::getKey)
                .toList();

        if (preferredGenreIds.isEmpty()) {
            return getTrending(limit);
        }

        List<Long> excludeList = excludeMovieIds.isEmpty() ? List.of(-1L) : new ArrayList<>(excludeMovieIds);
        return movieRepository.findTrendingByGenreIds(preferredGenreIds, excludeList, PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(movieMapper::toListDto)
                .toList();
    }

    private static double decayWeight(LocalDateTime eventTimeOrNull, LocalDateTime now) {
        if (eventTimeOrNull == null) return 1.0;
        long days = ChronoUnit.DAYS.between(eventTimeOrNull, now);
        if (days <= 0) return 1.0;
        return Math.exp(-DECAY_LAMBDA_PER_DAY * days);
    }
}

