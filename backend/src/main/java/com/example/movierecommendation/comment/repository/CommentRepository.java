package com.example.movierecommendation.comment.repository;

import com.example.movierecommendation.comment.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByMovieIdOrderByCreatedAtDesc(Long movieId, Pageable pageable);
}
