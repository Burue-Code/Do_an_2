package com.example.movierecommendation.movie.repository;

import com.example.movierecommendation.movie.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {

    List<Movie> findAllByOrderByRatingScoreDesc(Pageable pageable);

    List<Movie> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Movie> findAllByOrderByRatingCountDesc(Pageable pageable);

    Page<Movie> findByMovieType(Integer movieType, Pageable pageable);

    @Query("SELECT DISTINCT mg.movie FROM MovieGenre mg WHERE mg.genre.id IN :genreIds AND mg.movie.id NOT IN :excludeIds ORDER BY mg.movie.ratingScore DESC")
    Page<Movie> findRecommendedByGenreIds(@Param("genreIds") List<Long> genreIds, @Param("excludeIds") List<Long> excludeIds, Pageable pageable);
}

