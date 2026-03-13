package com.example.movierecommendation.movie.repository;

import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.entity.MovieGenre;
import com.example.movierecommendation.movie.entity.MovieGenreId;
import com.example.movierecommendation.genre.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieGenreRepository extends JpaRepository<MovieGenre, MovieGenreId> {

    List<MovieGenre> findByMovie(Movie movie);

    List<MovieGenre> findByGenre(Genre genre);
}

