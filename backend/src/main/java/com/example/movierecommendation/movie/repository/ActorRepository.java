package com.example.movierecommendation.movie.repository;

import com.example.movierecommendation.movie.entity.Actor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActorRepository extends JpaRepository<Actor, Long> {

    List<Actor> findAllByOrderByFullNameAsc();

    List<Actor> findTop10ByFullNameContainingIgnoreCaseOrderByFullNameAsc(String keyword);
}

