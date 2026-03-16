package com.example.movierecommendation.movie.repository;

import com.example.movierecommendation.movie.entity.Episode;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EpisodeRepository extends JpaRepository<Episode, Long> {

    List<Episode> findByMovie_IdOrderByEpisodeNumberAsc(Long movieId);
}
