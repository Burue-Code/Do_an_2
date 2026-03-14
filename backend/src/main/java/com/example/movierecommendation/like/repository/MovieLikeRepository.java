package com.example.movierecommendation.like.repository;

import com.example.movierecommendation.like.entity.MovieLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieLikeRepository extends JpaRepository<MovieLike, MovieLike.MovieLikeId> {

    boolean existsByUserIdAndMovieId(Long userId, Long movieId);

    Optional<MovieLike> findByUserIdAndMovieId(Long userId, Long movieId);
}
