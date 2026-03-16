package com.example.movierecommendation.movie.repository;

import com.example.movierecommendation.movie.entity.MovieActor;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieActorRepository extends JpaRepository<MovieActor, com.example.movierecommendation.movie.entity.MovieActorId> {

    List<MovieActor> findByMovieId(Long movieId);

    long countByActorId(Long actorId);
}
