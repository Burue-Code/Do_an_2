package com.example.movierecommendation.dashboard.service.impl;

import com.example.movierecommendation.comment.repository.CommentRepository;
import com.example.movierecommendation.dashboard.dto.DashboardOverviewResponse;
import com.example.movierecommendation.dashboard.dto.GenreStatisticResponse;
import com.example.movierecommendation.dashboard.dto.TrendingMovieResponse;
import com.example.movierecommendation.dashboard.service.DashboardService;
import com.example.movierecommendation.genre.entity.Genre;
import com.example.movierecommendation.genre.repository.GenreRepository;
import com.example.movierecommendation.like.repository.MovieLikeRepository;
import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.entity.MovieGenre;
import com.example.movierecommendation.movie.repository.MovieGenreRepository;
import com.example.movierecommendation.movie.repository.MovieRepository;
import com.example.movierecommendation.rating.repository.RatingRepository;
import com.example.movierecommendation.user.repository.UserRepository;
import com.example.movierecommendation.watchhistory.entity.WatchLog;
import com.example.movierecommendation.watchhistory.repository.WatchLogRepository;
import com.example.movierecommendation.watchlist.repository.WatchlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final CommentRepository commentRepository;
    private final RatingRepository ratingRepository;
    private final MovieLikeRepository movieLikeRepository;
    private final WatchlistRepository watchlistRepository;
    private final WatchLogRepository watchLogRepository;
    private final GenreRepository genreRepository;
    private final MovieGenreRepository movieGenreRepository;

    public DashboardServiceImpl(
            UserRepository userRepository,
            MovieRepository movieRepository,
            CommentRepository commentRepository,
            RatingRepository ratingRepository,
            MovieLikeRepository movieLikeRepository,
            WatchlistRepository watchlistRepository,
            WatchLogRepository watchLogRepository,
            GenreRepository genreRepository,
            MovieGenreRepository movieGenreRepository
    ) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.commentRepository = commentRepository;
        this.ratingRepository = ratingRepository;
        this.movieLikeRepository = movieLikeRepository;
        this.watchlistRepository = watchlistRepository;
        this.watchLogRepository = watchLogRepository;
        this.genreRepository = genreRepository;
        this.movieGenreRepository = movieGenreRepository;
    }

    @Override
    public DashboardOverviewResponse getOverview() {
        DashboardOverviewResponse resp = new DashboardOverviewResponse();
        resp.setTotalUsers(userRepository.count());
        resp.setTotalMovies(movieRepository.count());
        resp.setTotalComments(commentRepository.count());
        resp.setTotalRatings(ratingRepository.count());
        resp.setTotalLikes(movieLikeRepository.count());
        resp.setTotalWatchlistItems(watchlistRepository.count());
        resp.setTotalWatchLogs(watchLogRepository.count());
        return resp;
    }

    @Override
    public List<TrendingMovieResponse> getTrendingMovies(int limit) {
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        List<WatchLog> recentLogs = watchLogRepository.findAll().stream()
                .filter(log -> log.getLastWatchedAt() != null && log.getLastWatchedAt().isAfter(since))
                .collect(Collectors.toList());

        Map<Long, Long> watchCountByMovie = recentLogs.stream()
                .collect(Collectors.groupingBy(WatchLog::getMovieId, Collectors.counting()));

        List<Long> topMovieIds = watchCountByMovie.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        Map<Long, Movie> movieMap = movieRepository.findAllById(topMovieIds).stream()
                .collect(Collectors.toMap(Movie::getId, m -> m));

        return topMovieIds.stream()
                .map(id -> {
                    Movie movie = movieMap.get(id);
                    if (movie == null) {
                        return null;
                    }
                    TrendingMovieResponse dto = new TrendingMovieResponse();
                    dto.setMovieId(movie.getId());
                    dto.setTitle(movie.getTitle());
                    dto.setPoster(movie.getPoster());
                    dto.setRatingScore(movie.getRatingScore());
                    dto.setRatingCount(movie.getRatingCount());
                    dto.setWatchCountRecent(watchCountByMovie.getOrDefault(id, 0L));
                    return dto;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    @Override
    public List<GenreStatisticResponse> getGenreStatistics() {
        List<Genre> genres = genreRepository.findAll();
        List<MovieGenre> allMovieGenres = movieGenreRepository.findAll();

        Map<Long, Long> movieCountByGenre = allMovieGenres.stream()
                .collect(Collectors.groupingBy(mg -> mg.getGenre().getId(), Collectors.counting()));

        return genres.stream()
                .map(genre -> {
                    GenreStatisticResponse dto = new GenreStatisticResponse();
                    dto.setGenreId(genre.getId());
                    dto.setGenreName(genre.getName());
                    dto.setMovieCount(movieCountByGenre.getOrDefault(genre.getId(), 0L));
                    return dto;
                })
                .sorted(Comparator.comparingLong(GenreStatisticResponse::getMovieCount).reversed())
                .collect(Collectors.toList());
    }
}

