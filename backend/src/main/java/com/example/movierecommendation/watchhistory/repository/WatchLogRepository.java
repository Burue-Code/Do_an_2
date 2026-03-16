package com.example.movierecommendation.watchhistory.repository;

import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.watchhistory.entity.WatchLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchLogRepository extends JpaRepository<WatchLog, Long> {

    List<WatchLog> findByUserOrderByLastWatchedAtDesc(User user);

    List<WatchLog> findByUser_IdOrderByLastWatchedAtDesc(Long userId, Pageable pageable);

    Optional<WatchLog> findByUserAndMovie_IdAndEpisodeId(User user, Long movieId, Long episodeId);

    long countByMovie_Id(Long movieId);

    long countByMovie_IdAndCompletedTrue(Long movieId);
}

