package com.example.movierecommendation.like.repository;

import com.example.movierecommendation.like.entity.MovieLike;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface MovieLikeRepository extends JpaRepository<MovieLike, MovieLike.MovieLikeId> {

    boolean existsByUserIdAndMovieId(Long userId, Long movieId);

    Optional<MovieLike> findByUserIdAndMovieId(Long userId, Long movieId);

    List<MovieLike> findById_UserId(Long userId);

    long countById_MovieId(Long movieId);

    @Query("""
            SELECT ml.id.userId
            FROM MovieLike ml
            WHERE ml.movie.id IN :movieIds
            GROUP BY ml.id.userId
            ORDER BY COUNT(ml) DESC
            """)
    List<Long> findTopUserIdsWhoLikedMovies(@Param("movieIds") Collection<Long> movieIds, Pageable pageable);
}
