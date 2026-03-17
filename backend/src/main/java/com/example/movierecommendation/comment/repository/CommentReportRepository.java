package com.example.movierecommendation.comment.repository;

import com.example.movierecommendation.comment.entity.CommentReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentReportRepository extends JpaRepository<CommentReport, Long> {

    Optional<CommentReport> findByComment_IdAndReporter_Id(Long commentId, Long reporterId);

    long countByComment_IdAndResolvedFalse(Long commentId);

    Page<CommentReport> findByResolvedFalseOrderByCreatedAtDesc(Pageable pageable);

    Page<CommentReport> findByResolvedTrueOrderByResolvedAtDesc(Pageable pageable);
}

