package com.example.movierecommendation.watchlist.repository;

import com.example.movierecommendation.watchlist.entity.WatchlistItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {

    boolean existsByUserIdAndMovieId(Long userId, Long movieId);

    Optional<WatchlistItem> findByUserIdAndMovieId(Long userId, Long movieId);

    Page<WatchlistItem> findAllByUserId(Long userId, Pageable pageable);
}

