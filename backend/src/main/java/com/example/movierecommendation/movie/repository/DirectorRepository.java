package com.example.movierecommendation.movie.repository;

import com.example.movierecommendation.movie.entity.Director;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DirectorRepository extends JpaRepository<Director, Long> {

    List<Director> findAllByOrderByFullNameAsc();

    List<Director> findTop10ByFullNameContainingIgnoreCaseOrderByFullNameAsc(String keyword);
}

