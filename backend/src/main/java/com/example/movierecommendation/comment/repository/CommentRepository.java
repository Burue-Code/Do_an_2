package com.example.movierecommendation.comment.repository;

import com.example.movierecommendation.comment.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByMovie_IdOrderByCreatedAtDesc(Long movieId, Pageable pageable);

    long countByMovie_Id(Long movieId);

    @Query("""
            SELECT c
            FROM Comment c
            JOIN c.user u
            JOIN c.movie m
            WHERE (:movieId IS NULL OR m.id = :movieId)
              AND (:username IS NULL OR :username = '' OR u.username LIKE %:username%)
              AND (:keyword IS NULL OR :keyword = '' OR c.content LIKE %:keyword%)
            ORDER BY c.createdAt DESC
            """)
    Page<Comment> adminSearch(@Param("movieId") Long movieId,
                              @Param("username") String username,
                              @Param("keyword") String keyword,
                              Pageable pageable);
}
