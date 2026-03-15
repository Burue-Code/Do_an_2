package com.example.movierecommendation.watchlist.service.impl;

import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.mapper.MovieMapper;
import com.example.movierecommendation.movie.repository.MovieRepository;
import com.example.movierecommendation.security.SecurityUtils;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.repository.UserRepository;
import com.example.movierecommendation.watchlist.dto.WatchlistToggleResponse;
import com.example.movierecommendation.watchlist.entity.WatchlistItem;
import com.example.movierecommendation.watchlist.repository.WatchlistRepository;
import com.example.movierecommendation.watchlist.service.WatchlistService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WatchlistServiceImpl implements WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;

    public WatchlistServiceImpl(WatchlistRepository watchlistRepository,
                                UserRepository userRepository,
                                MovieRepository movieRepository,
                                MovieMapper movieMapper) {
        this.watchlistRepository = watchlistRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.movieMapper = movieMapper;
    }

    @Override
    @Transactional
    public WatchlistToggleResponse toggle(Long movieId) {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalStateException("Authentication required"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found: " + movieId));

        return watchlistRepository.findByUserIdAndMovieId(user.getId(), movieId)
                .map(existing -> {
                    watchlistRepository.delete(existing);
                    return new WatchlistToggleResponse(false);
                })
                .orElseGet(() -> {
                    WatchlistItem item = new WatchlistItem();
                    item.setUser(user);
                    item.setMovie(movie);
                    watchlistRepository.save(item);
                    return new WatchlistToggleResponse(true);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isInWatchlist(Long movieId) {
        return SecurityUtils.getCurrentUsername()
                .flatMap(username -> userRepository.findByUsername(username))
                .map(user -> watchlistRepository.existsByUserIdAndMovieId(user.getId(), movieId))
                .orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovieListResponse> getCurrentUserWatchlist(Pageable pageable) {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalStateException("Authentication required"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        Page<WatchlistItem> page = watchlistRepository.findAllByUserId(user.getId(), pageable);

        List<MovieListResponse> content = page.getContent().stream()
                .map(WatchlistItem::getMovie)
                .map(movieMapper::toListDto)
                .collect(Collectors.toList());

        return new PageImpl<>(
                content,
                pageable,
                page.getTotalElements()
        );
    }
}

