package com.example.movierecommendation.recommendation.service;

import com.example.movierecommendation.like.repository.MovieLikeRepository;
import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.mapper.MovieMapper;
import com.example.movierecommendation.movie.repository.MovieGenreRepository;
import com.example.movierecommendation.movie.repository.MovieRepository;
import com.example.movierecommendation.movie.service.MovieQueryService;
import com.example.movierecommendation.recommendation.dto.RecommendationItemResponse;
import com.example.movierecommendation.watchhistory.repository.WatchLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    private static final int MAX_GENRES_TO_USE = 5;
    private static final int MAX_WATCHED_TO_ANALYSE = 80;

    private final MovieQueryService movieQueryService;
    private final MovieLikeRepository movieLikeRepository;
    private final WatchLogRepository watchLogRepository;
    private final MovieGenreRepository movieGenreRepository;
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;

    public RecommendationServiceImpl(MovieQueryService movieQueryService,
                                    MovieLikeRepository movieLikeRepository,
                                    WatchLogRepository watchLogRepository,
                                    MovieGenreRepository movieGenreRepository,
                                    MovieRepository movieRepository,
                                    MovieMapper movieMapper) {
        this.movieQueryService = movieQueryService;
        this.movieLikeRepository = movieLikeRepository;
        this.watchLogRepository = watchLogRepository;
        this.movieGenreRepository = movieGenreRepository;
        this.movieRepository = movieRepository;
        this.movieMapper = movieMapper;
    }

    @Override
    public List<RecommendationItemResponse> getRecommendationsForUser(Long userId, int limit) {
        Set<Long> excludeMovieIds = new HashSet<>();

        List<Long> likedMovieIds = movieLikeRepository.findById_UserId(userId).stream()
                .map(ma -> ma.getMovie().getId())
                .toList();
        excludeMovieIds.addAll(likedMovieIds);

        List<Long> watchedMovieIds = watchLogRepository
                .findByUser_IdOrderByLastWatchedAtDesc(userId, PageRequest.of(0, MAX_WATCHED_TO_ANALYSE))
                .stream()
                .map(wl -> wl.getMovie().getId())
                .distinct()
                .toList();
        excludeMovieIds.addAll(watchedMovieIds);

        List<Long> sourceMovieIds = new ArrayList<>(likedMovieIds);
        sourceMovieIds.addAll(watchedMovieIds);

        List<Long> preferredGenreIds = Collections.emptyList();
        if (!sourceMovieIds.isEmpty()) {
            List<com.example.movierecommendation.movie.entity.MovieGenre> movieGenres =
                    movieGenreRepository.findByMovie_IdIn(sourceMovieIds);
            Map<Long, Long> genreCount = movieGenres.stream()
                    .collect(Collectors.groupingBy(
                            mg -> mg.getGenre().getId(),
                            Collectors.counting()));
            preferredGenreIds = genreCount.entrySet().stream()
                    .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                    .limit(MAX_GENRES_TO_USE)
                    .map(Map.Entry::getKey)
                    .toList();
        }

        List<Movie> recommendedMovies;
        if (!preferredGenreIds.isEmpty()) {
            List<Long> excludeList = excludeMovieIds.isEmpty() ? List.of(-1L) : new ArrayList<>(excludeMovieIds);
            recommendedMovies = movieRepository.findRecommendedByGenreIds(
                    preferredGenreIds, excludeList, PageRequest.of(0, limit)).getContent();
        } else {
            recommendedMovies = movieRepository.findAllByOrderByRatingScoreDesc(PageRequest.of(0, limit * 2))
                    .stream()
                    .filter(m -> !excludeMovieIds.contains(m.getId()))
                    .limit(limit)
                    .toList();
        }

        float score = 0.95f;
        float step = 0.03f;
        List<RecommendationItemResponse> result = new ArrayList<>();
        for (Movie m : recommendedMovies) {
            result.add(new RecommendationItemResponse(movieMapper.toListDto(m), score));
            score = Math.max(0.5f, score - step);
        }
        return result;
    }

    @Override
    public List<RecommendationItemResponse> getHomeRecommendations(Long userIdOrNull, int limit) {
        if (userIdOrNull != null) {
            return getRecommendationsForUser(userIdOrNull, limit);
        }
        List<MovieListResponse> movies = movieQueryService.getTrending(limit);
        return movies.stream()
                .map(m -> new RecommendationItemResponse(m, 0.8f))
                .toList();
    }
}