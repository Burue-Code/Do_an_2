package com.example.movierecommendation.dashboard.service.impl;

import com.example.movierecommendation.comment.repository.CommentRepository;
import com.example.movierecommendation.dashboard.dto.DashboardOverviewResponse;
import com.example.movierecommendation.dashboard.dto.GenreStatisticResponse;
import com.example.movierecommendation.dashboard.dto.TrendingMovieResponse;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private MovieRepository movieRepository;
    @Mock
    private CommentRepository commentRepository;
    @Mock
    private RatingRepository ratingRepository;
    @Mock
    private MovieLikeRepository movieLikeRepository;
    @Mock
    private WatchlistRepository watchlistRepository;
    @Mock
    private WatchLogRepository watchLogRepository;
    @Mock
    private GenreRepository genreRepository;
    @Mock
    private MovieGenreRepository movieGenreRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @BeforeEach
    void setUp() {
        // no-op, kept for future shared setup if needed
    }

    @Test
    void getOverview_shouldReturnCountsFromRepositories() {
        when(userRepository.count()).thenReturn(10L);
        when(movieRepository.count()).thenReturn(20L);
        when(commentRepository.count()).thenReturn(30L);
        when(ratingRepository.count()).thenReturn(40L);
        when(movieLikeRepository.count()).thenReturn(50L);
        when(watchlistRepository.count()).thenReturn(60L);
        when(watchLogRepository.count()).thenReturn(70L);

        DashboardOverviewResponse result = dashboardService.getOverview();

        assertThat(result.getTotalUsers()).isEqualTo(10L);
        assertThat(result.getTotalMovies()).isEqualTo(20L);
        assertThat(result.getTotalComments()).isEqualTo(30L);
        assertThat(result.getTotalRatings()).isEqualTo(40L);
        assertThat(result.getTotalLikes()).isEqualTo(50L);
        assertThat(result.getTotalWatchlistItems()).isEqualTo(60L);
        assertThat(result.getTotalWatchLogs()).isEqualTo(70L);
    }

    @Test
    void getTrendingMovies_shouldReturnMoviesSortedByRecentWatchCount() {
        Movie movie1 = new Movie();
        movie1.setId(1L);
        movie1.setTitle("Movie 1");
        movie1.setPoster("poster1");
        movie1.setRatingScore(4.5f);
        movie1.setRatingCount(100);

        Movie movie2 = new Movie();
        movie2.setId(2L);
        movie2.setTitle("Movie 2");
        movie2.setPoster("poster2");
        movie2.setRatingScore(4.0f);
        movie2.setRatingCount(50);

        WatchLog log1 = new WatchLog();
        log1.setMovie(movie1);
        log1.setLastWatchedAt(LocalDateTime.now().minusDays(1));

        WatchLog log2 = new WatchLog();
        log2.setMovie(movie1);
        log2.setLastWatchedAt(LocalDateTime.now().minusDays(2));

        WatchLog log3 = new WatchLog();
        log3.setMovie(movie2);
        log3.setLastWatchedAt(LocalDateTime.now().minusDays(3));

        when(watchLogRepository.findAll()).thenReturn(Arrays.asList(log1, log2, log3));
        when(movieRepository.findAllById(Arrays.asList(1L, 2L))).thenReturn(Arrays.asList(movie1, movie2));

        List<TrendingMovieResponse> result = dashboardService.getTrendingMovies(10);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getMovieId()).isEqualTo(1L);
        assertThat(result.get(0).getWatchCountRecent()).isEqualTo(2L);
        assertThat(result.get(1).getMovieId()).isEqualTo(2L);
        assertThat(result.get(1).getWatchCountRecent()).isEqualTo(1L);
    }

    @Test
    void getGenreStatistics_shouldReturnMovieCountPerGenreSortedDesc() {
        Genre genre1 = new Genre();
        genre1.setId(1L);
        genre1.setName("Action");

        Genre genre2 = new Genre();
        genre2.setId(2L);
        genre2.setName("Drama");

        MovieGenre mg1 = new MovieGenre();
        mg1.setGenre(genre1);

        MovieGenre mg2 = new MovieGenre();
        mg2.setGenre(genre1);

        MovieGenre mg3 = new MovieGenre();
        mg3.setGenre(genre2);

        when(genreRepository.findAll()).thenReturn(Arrays.asList(genre1, genre2));
        when(movieGenreRepository.findAll()).thenReturn(Arrays.asList(mg1, mg2, mg3));

        List<GenreStatisticResponse> result = dashboardService.getGenreStatistics();

        assertThat(result).hasSize(2);
        // genre1 has 2 movies, genre2 has 1 -> genre1 should come first
        assertThat(result.get(0).getGenreId()).isEqualTo(1L);
        assertThat(result.get(0).getMovieCount()).isEqualTo(2L);
        assertThat(result.get(1).getGenreId()).isEqualTo(2L);
        assertThat(result.get(1).getMovieCount()).isEqualTo(1L);
    }

    @Test
    void getTrendingMovies_shouldReturnEmptyListWhenNoRecentLogs() {
        when(watchLogRepository.findAll()).thenReturn(Collections.emptyList());

        List<TrendingMovieResponse> result = dashboardService.getTrendingMovies(5);

        assertThat(result).isEmpty();
    }
}

