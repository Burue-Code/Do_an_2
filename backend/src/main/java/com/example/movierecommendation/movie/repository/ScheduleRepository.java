package com.example.movierecommendation.movie.repository;

import com.example.movierecommendation.movie.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByMovie_IdOrderByIdAsc(Long movieId);
}

