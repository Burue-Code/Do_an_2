package com.example.movierecommendation.movie.repository;

import com.example.movierecommendation.movie.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}

