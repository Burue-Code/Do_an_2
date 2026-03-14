package com.example.movierecommendation.watchhistory.repository;

import com.example.movierecommendation.watchhistory.entity.WatchLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchLogRepository extends JpaRepository<WatchLog, Long> {

    List<WatchLog> findByUserIdOrderByLastWatchedAtDesc(Long userId);

    Optional<WatchLog> findByUserIdAndMovieIdAndEpisodeId(Long userId, Long movieId, Long episodeId);
}

