package com.example.movierecommendation.watchhistory.repository;

import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.watchhistory.entity.WatchLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface WatchLogRepository extends JpaRepository<WatchLog, Long> {

    List<WatchLog> findByUserOrderByLastWatchedAtDesc(User user);

    List<WatchLog> findByUser_IdOrderByLastWatchedAtDesc(Long userId, Pageable pageable);

    Optional<WatchLog> findByUserAndMovie_IdAndEpisodeId(User user, Long movieId, Long episodeId);

    List<WatchLog> findByUser_IdAndCompletedTrue(Long userId);

    long countByMovie_Id(Long movieId);

    long countByMovie_IdAndCompletedTrue(Long movieId);

    @Query("""
            SELECT wl.user.id
            FROM WatchLog wl
            WHERE wl.movie.id IN :movieIds
            GROUP BY wl.user.id
            ORDER BY COUNT(wl) DESC
            """)
    List<Long> findTopUserIdsWhoWatchedMovies(@Param("movieIds") Collection<Long> movieIds, Pageable pageable);
}

