package com.example.movierecommendation.comment.service.impl;

import com.example.movierecommendation.comment.dto.AdminCommentReportResponse;
import com.example.movierecommendation.comment.dto.AdminCommentResponse;
import com.example.movierecommendation.comment.entity.Comment;
import com.example.movierecommendation.comment.entity.CommentReport;
import com.example.movierecommendation.comment.repository.CommentReportRepository;
import com.example.movierecommendation.comment.repository.CommentRepository;
import com.example.movierecommendation.comment.service.AdminCommentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AdminCommentServiceImpl implements AdminCommentService {

    private final CommentRepository commentRepository;
    private final CommentReportRepository commentReportRepository;

    public AdminCommentServiceImpl(CommentRepository commentRepository,
                                  CommentReportRepository commentReportRepository) {
        this.commentRepository = commentRepository;
        this.commentReportRepository = commentReportRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminCommentResponse> searchComments(Long movieId, String username, String keyword, Pageable pageable) {
        return commentRepository.adminSearch(movieId, username, keyword, pageable)
                .map(this::toAdminResponse);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new IllegalArgumentException("Comment not found: " + commentId);
        }
        commentRepository.deleteById(commentId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminCommentReportResponse> getUnresolvedReports(Pageable pageable) {
        return commentReportRepository.findByResolvedFalseOrderByCreatedAtDesc(pageable)
                .map(this::toReportResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminCommentReportResponse> getResolvedReports(Pageable pageable) {
        return commentReportRepository.findByResolvedTrueOrderByResolvedAtDesc(pageable)
                .map(this::toReportResponse);
    }

    @Override
    @Transactional
    public void resolveReport(Long reportId) {
        CommentReport r = commentReportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found: " + reportId));
        r.setResolved(true);
        r.setResolvedAt(LocalDateTime.now());
        commentReportRepository.save(r);
    }

    @Override
    @Transactional
    public void deleteReport(Long reportId) {
        if (!commentReportRepository.existsById(reportId)) {
            throw new IllegalArgumentException("Report not found: " + reportId);
        }
        commentReportRepository.deleteById(reportId);
    }

    private AdminCommentResponse toAdminResponse(Comment c) {
        AdminCommentResponse dto = new AdminCommentResponse();
        dto.setId(c.getId());
        dto.setContent(c.getContent());
        dto.setCreatedAt(c.getCreatedAt());
        if (c.getMovie() != null) {
            dto.setMovieId(c.getMovie().getId());
            dto.setMovieTitle(c.getMovie().getTitle());
        }
        if (c.getUser() != null) {
            dto.setUserId(c.getUser().getId());
            dto.setUsername(c.getUser().getUsername());
        }
        dto.setUnresolvedReportsCount(commentReportRepository.countByComment_IdAndResolvedFalse(c.getId()));
        return dto;
    }

    private AdminCommentReportResponse toReportResponse(CommentReport r) {
        AdminCommentReportResponse dto = new AdminCommentReportResponse();
        dto.setReportId(r.getId());
        dto.setReason(r.getReason());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setResolved(r.getResolved());

        if (r.getReporter() != null) {
            dto.setReporterUserId(r.getReporter().getId());
            dto.setReporterUsername(r.getReporter().getUsername());
        }
        if (r.getComment() != null) {
            Comment c = r.getComment();
            dto.setCommentId(c.getId());
            dto.setCommentContent(c.getContent());
            dto.setCommentCreatedAt(c.getCreatedAt());
            if (c.getUser() != null) {
                dto.setCommentUserId(c.getUser().getId());
                dto.setCommentUsername(c.getUser().getUsername());
            }
            if (c.getMovie() != null) {
                dto.setMovieId(c.getMovie().getId());
                dto.setMovieTitle(c.getMovie().getTitle());
            }
        }
        return dto;
    }
}

