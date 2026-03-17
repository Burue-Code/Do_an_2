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

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    private static final int MAX_GENRES_TO_USE = 5;
    private static final int MAX_WATCHED_TO_ANALYSE = 80;
    private static final int MAX_LIKES_TO_ANALYSE = 80;
    private static final int MAX_SIMILAR_USERS = 25;
    private static final int MAX_MOVIES_PER_SIMILAR_USER = 60;

    private static final double CONTENT_WEIGHT = 0.6;
    private static final double COLLAB_WEIGHT = 0.4;

    /**
     * Time-decay để bám sở thích mới.
     * Half-life mặc định ~14 ngày: hành vi cách 14 ngày chỉ còn 50% trọng số.
     */
    private static final double DECAY_LAMBDA_PER_DAY = Math.log(2) / 14.0;
    private static final double LIKE_BASE_WEIGHT = 2.0;
    private static final double WATCH_BASE_WEIGHT = 1.0;

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

        LocalDateTime now = LocalDateTime.now();

        var likes = movieLikeRepository.findById_UserId(userId).stream()
                .sorted(Comparator.comparing((com.example.movierecommendation.like.entity.MovieLike ml) -> {
                    LocalDateTime t = ml.getCreatedAt();
                    return t == null ? LocalDateTime.MIN : t;
                }).reversed())
                .limit(MAX_LIKES_TO_ANALYSE)
                .toList();

        List<Long> likedMovieIds = likes.stream()
                .map(ml -> ml.getMovie().getId())
                .toList();
        excludeMovieIds.addAll(likedMovieIds);

        var watchLogs = watchLogRepository
                .findByUser_IdOrderByLastWatchedAtDesc(userId, PageRequest.of(0, MAX_WATCHED_TO_ANALYSE));

        List<Long> watchedMovieIds = watchLogs.stream()
                .map(wl -> wl.getMovie().getId())
                .distinct()
                .toList();
        excludeMovieIds.addAll(watchedMovieIds);

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

        List<Long> sourceMovieIds = new ArrayList<>(movieWeights.keySet());

        List<Long> preferredGenreIds = Collections.emptyList();
        if (!sourceMovieIds.isEmpty()) {
            List<com.example.movierecommendation.movie.entity.MovieGenre> movieGenres =
                    movieGenreRepository.findByMovie_IdIn(sourceMovieIds);
            Map<Long, Double> genreScore = new HashMap<>();
            for (var mg : movieGenres) {
                Long movieId = mg.getMovie().getId();
                Double mw = movieWeights.get(movieId);
                if (mw == null) continue;
                genreScore.merge(mg.getGenre().getId(), mw, Double::sum);
            }
            preferredGenreIds = genreScore.entrySet().stream()
                    .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
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

        Map<Long, Double> contentScores = buildLinearScores(recommendedMovies);
        Map<Long, Double> collabScores = buildCollaborativeScores(userId, now, excludeMovieIds, sourceMovieIds, limit);

        Map<Long, Double> finalScores = new HashMap<>();
        for (var e : contentScores.entrySet()) {
            finalScores.merge(e.getKey(), e.getValue() * CONTENT_WEIGHT, Double::sum);
        }
        for (var e : collabScores.entrySet()) {
            finalScores.merge(e.getKey(), e.getValue() * COLLAB_WEIGHT, Double::sum);
        }

        List<Long> movieIdsSorted = finalScores.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .limit(limit)
                .toList();

        if (movieIdsSorted.isEmpty()) {
            return recommendedMovies.stream()
                    .limit(limit)
                    .map(m -> new RecommendationItemResponse(movieMapper.toListDto(m), 0.8f))
                    .toList();
        }

        Map<Long, Movie> moviesById = movieRepository.findAllById(movieIdsSorted).stream()
                .collect(Collectors.toMap(Movie::getId, m -> m));

        List<RecommendationItemResponse> result = new ArrayList<>();
        for (Long id : movieIdsSorted) {
            Movie m = moviesById.get(id);
            if (m == null) continue;
            float s = (float) Math.max(0.5, Math.min(0.99, finalScores.getOrDefault(id, 0.75)));
            result.add(new RecommendationItemResponse(movieMapper.toListDto(m), s));
        }
        return result;
    }

    private Map<Long, Double> buildLinearScores(List<Movie> movies) {
        Map<Long, Double> scores = new HashMap<>();
        double score = 0.95;
        double step = 0.03;
        for (Movie m : movies) {
            scores.put(m.getId(), score);
            score = Math.max(0.5, score - step);
        }
        return scores;
    }

    private Map<Long, Double> buildCollaborativeScores(
            Long userId,
            LocalDateTime now,
            Set<Long> excludeMovieIds,
            List<Long> sourceMovieIds,
            int limit
    ) {
        if (sourceMovieIds == null || sourceMovieIds.isEmpty()) {
            return Collections.emptyMap();
        }

        // 1) Lấy danh sách user "tương tự" dựa trên overlap movieIds (like/watch)
        Set<Long> similarUserIds = new LinkedHashSet<>();
        similarUserIds.addAll(movieLikeRepository.findTopUserIdsWhoLikedMovies(
                sourceMovieIds, PageRequest.of(0, MAX_SIMILAR_USERS)));
        similarUserIds.addAll(watchLogRepository.findTopUserIdsWhoWatchedMovies(
                sourceMovieIds, PageRequest.of(0, MAX_SIMILAR_USERS)));
        similarUserIds.remove(userId);

        if (similarUserIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Set<Long> mySet = new HashSet<>(sourceMovieIds);
        Map<Long, Double> candidateScores = new HashMap<>();

        // 2) Với mỗi user tương tự: tính similarity và cộng điểm cho phim họ tương tác
        for (Long otherUserId : similarUserIds.stream().limit(MAX_SIMILAR_USERS).toList()) {
            var otherLikes = movieLikeRepository.findById_UserId(otherUserId).stream()
                    .sorted(Comparator.comparing((com.example.movierecommendation.like.entity.MovieLike ml) -> {
                        LocalDateTime t = ml.getCreatedAt();
                        return t == null ? LocalDateTime.MIN : t;
                    }).reversed())
                    .limit(MAX_LIKES_TO_ANALYSE)
                    .toList();

            var otherWatchLogs = watchLogRepository.findByUser_IdOrderByLastWatchedAtDesc(
                    otherUserId, PageRequest.of(0, MAX_WATCHED_TO_ANALYSE));

            Set<Long> otherSet = new HashSet<>();
            otherLikes.forEach(ml -> otherSet.add(ml.getMovie().getId()));
            otherWatchLogs.forEach(wl -> otherSet.add(wl.getMovie().getId()));

            if (otherSet.isEmpty()) continue;

            int overlap = 0;
            for (Long mid : otherSet) {
                if (mySet.contains(mid)) overlap++;
            }
            if (overlap == 0) continue;

            int union = mySet.size() + otherSet.size() - overlap;
            double sim = union <= 0 ? 0.0 : (double) overlap / (double) union; // Jaccard
            if (sim <= 0) continue;

            // điểm phim từ user kia: hành vi càng mới càng nặng
            int added = 0;
            for (var ml : otherLikes) {
                Long movieId = ml.getMovie().getId();
                if (excludeMovieIds.contains(movieId)) continue;
                double w = LIKE_BASE_WEIGHT * decayWeight(ml.getCreatedAt(), now);
                candidateScores.merge(movieId, sim * w, Double::sum);
                if (++added >= MAX_MOVIES_PER_SIMILAR_USER) break;
            }
            for (var wl : otherWatchLogs) {
                Long movieId = wl.getMovie().getId();
                if (excludeMovieIds.contains(movieId)) continue;
                double w = WATCH_BASE_WEIGHT * decayWeight(wl.getLastWatchedAt(), now);
                if (Boolean.TRUE.equals(wl.getCompleted())) {
                    w *= 1.2;
                }
                candidateScores.merge(movieId, sim * w, Double::sum);
                if (++added >= MAX_MOVIES_PER_SIMILAR_USER * 2) break;
            }
        }

        if (candidateScores.isEmpty()) {
            return Collections.emptyMap();
        }

        // 3) Chuẩn hoá về khoảng ~[0.5..0.95] để dễ merge với content score
        double max = candidateScores.values().stream().mapToDouble(v -> v).max().orElse(1.0);
        if (max <= 0) return Collections.emptyMap();

        Map<Long, Double> normalized = new HashMap<>();
        for (var e : candidateScores.entrySet()) {
            double s = 0.5 + 0.45 * (e.getValue() / max);
            normalized.put(e.getKey(), s);
        }

        // giới hạn bớt số ứng viên để tránh query movie quá lớn
        return normalized.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(Math.max(limit * 3L, 60L))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new));
    }

    private static double decayWeight(LocalDateTime eventTimeOrNull, LocalDateTime now) {
        if (eventTimeOrNull == null) return 1.0;
        long days = ChronoUnit.DAYS.between(eventTimeOrNull, now);
        if (days <= 0) return 1.0;
        return Math.exp(-DECAY_LAMBDA_PER_DAY * days);
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