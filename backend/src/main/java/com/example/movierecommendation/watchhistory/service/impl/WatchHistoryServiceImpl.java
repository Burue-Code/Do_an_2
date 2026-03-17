package com.example.movierecommendation.watchhistory.service.impl;

import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.entity.Episode;
import com.example.movierecommendation.movie.mapper.MovieMapper;
import com.example.movierecommendation.movie.repository.MovieRepository;
import com.example.movierecommendation.movie.repository.EpisodeRepository;
import com.example.movierecommendation.security.SecurityUtils;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.repository.UserRepository;
import com.example.movierecommendation.watchhistory.dto.ContinueWatchingItemResponse;
import com.example.movierecommendation.watchhistory.dto.ContinueWatchingResponse;
import com.example.movierecommendation.watchhistory.dto.SaveWatchLogRequest;
import com.example.movierecommendation.watchhistory.entity.WatchLog;
import com.example.movierecommendation.watchhistory.repository.WatchLogRepository;
import com.example.movierecommendation.watchhistory.service.WatchHistoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WatchHistoryServiceImpl implements WatchHistoryService {

    private final WatchLogRepository watchLogRepository;
    private final UserRepository userRepository;
    private final MovieMapper movieMapper;
    private final MovieRepository movieRepository;
    private final EpisodeRepository episodeRepository;

    public WatchHistoryServiceImpl(WatchLogRepository watchLogRepository,
                                   UserRepository userRepository,
                                   MovieMapper movieMapper,
                                   MovieRepository movieRepository,
                                   EpisodeRepository episodeRepository) {
        this.watchLogRepository = watchLogRepository;
        this.userRepository = userRepository;
        this.movieMapper = movieMapper;
        this.movieRepository = movieRepository;
        this.episodeRepository = episodeRepository;
    }

    @Override
    public ContinueWatchingResponse getContinueWatching(int limit) {
        var user = SecurityUtils.getCurrentUsername()
                .flatMap(userRepository::findByUsername)
                .orElse(null);
        if (user == null) {
            ContinueWatchingResponse response = new ContinueWatchingResponse();
            response.setItems(List.of());
            return response;
        }

        List<WatchLog> logs = watchLogRepository.findByUserOrderByLastWatchedAtDesc(user);
        List<ContinueWatchingItemResponse> items = logs.stream()
                .limit(limit)
                .map(this::toItem)
                .collect(Collectors.toList());

        ContinueWatchingResponse response = new ContinueWatchingResponse();
        response.setItems(items);
        return response;
    }

    @Override
    public void saveWatchLog(SaveWatchLogRequest request) {
        User user = SecurityUtils.getCurrentUsername()
                .flatMap(userRepository::findByUsername)
                .orElse(null);
        if (user == null) {
            return;
        }

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElse(null);
        if (movie == null) {
            return;
        }

        Long episodeId = request.getEpisodeId();
        WatchLog log = watchLogRepository
                .findByUserAndMovie_IdAndEpisodeId(user, request.getMovieId(), episodeId)
                .orElse(null);
        if (log == null) {
            log = new WatchLog();
            log.setUser(user);
            log.setMovie(movie);
            log.setEpisodeId(episodeId);
        }

        log.setDurationWatched(request.getDurationWatched());
        if (request.getCompleted() != null) {
            log.setCompleted(request.getCompleted());
        }
        log.setLastWatchedAt(java.time.LocalDateTime.now());

        watchLogRepository.save(log);
    }

    private ContinueWatchingItemResponse toItem(WatchLog log) {
        ContinueWatchingItemResponse item = new ContinueWatchingItemResponse();
        MovieListResponse movie = movieMapper.toListDto(log.getMovie());
        item.setMovie(movie);
        Integer durationWatchedSeconds = log.getDurationWatched();

        Integer totalDurationSeconds = null;
        if (log.getEpisodeId() != null) {
            Episode ep = episodeRepository.findById(log.getEpisodeId()).orElse(null);
            if (ep != null) {
                Integer minutes = ep.getDurationMinutes();
                if (minutes != null) {
                    totalDurationSeconds = minutes * 60;
                }
            }
        } else {
            Integer movieMinutes = log.getMovie().getDuration();
            if (movieMinutes != null) {
                totalDurationSeconds = movieMinutes * 60;
            }
        }

        if (totalDurationSeconds != null && totalDurationSeconds > 0 && durationWatchedSeconds != null) {
            item.setProgressPercent(Math.min(100, (durationWatchedSeconds * 100) / totalDurationSeconds));
        } else {
            item.setProgressPercent(0);
        }

        item.setEpisodeNumber(log.getEpisodeId() != null ? log.getEpisodeId().intValue() : null);
        item.setDurationWatchedMinutes(durationWatchedSeconds);
        return item;
    }
}
