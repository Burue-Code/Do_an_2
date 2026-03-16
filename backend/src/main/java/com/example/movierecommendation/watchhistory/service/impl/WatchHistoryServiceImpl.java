package com.example.movierecommendation.watchhistory.service.impl;

import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.movie.mapper.MovieMapper;
import com.example.movierecommendation.security.SecurityUtils;
import com.example.movierecommendation.user.repository.UserRepository;
import com.example.movierecommendation.watchhistory.dto.ContinueWatchingItemResponse;
import com.example.movierecommendation.watchhistory.dto.ContinueWatchingResponse;
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

    public WatchHistoryServiceImpl(WatchLogRepository watchLogRepository,
                                   UserRepository userRepository,
                                   MovieMapper movieMapper) {
        this.watchLogRepository = watchLogRepository;
        this.userRepository = userRepository;
        this.movieMapper = movieMapper;
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

    private ContinueWatchingItemResponse toItem(WatchLog log) {
        ContinueWatchingItemResponse item = new ContinueWatchingItemResponse();
        MovieListResponse movie = movieMapper.toListDto(log.getMovie());
        item.setMovie(movie);
        Integer durationWatched = log.getDurationWatched();
        Integer duration = log.getMovie().getDuration();
        if (duration != null && duration > 0 && durationWatched != null) {
            item.setProgressPercent(Math.min(100, (durationWatched * 100) / duration));
        } else {
            item.setProgressPercent(0);
        }
        item.setEpisodeNumber(log.getEpisodeId() != null ? log.getEpisodeId().intValue() : null);
        return item;
    }
}
