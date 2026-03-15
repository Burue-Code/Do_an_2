package com.example.movierecommendation.user.repository;

import com.example.movierecommendation.user.entity.UserGenre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserGenreRepository extends JpaRepository<UserGenre, com.example.movierecommendation.user.entity.UserGenreId> {

    List<UserGenre> findByUser_Id(Long userId);

    void deleteByUser_Id(Long userId);
}
