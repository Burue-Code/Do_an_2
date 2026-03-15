package com.example.movierecommendation.movie.repository;

import com.example.movierecommendation.movie.entity.MovieDirector;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieDirectorRepository extends JpaRepository<MovieDirector, com.example.movierecommendation.movie.entity.MovieDirectorId> {

    List<MovieDirector> findByMovieId(Long movieId);
}
