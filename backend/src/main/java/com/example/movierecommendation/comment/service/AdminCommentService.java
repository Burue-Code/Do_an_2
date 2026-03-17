package com.example.movierecommendation.comment.service;

import com.example.movierecommendation.comment.dto.AdminCommentReportResponse;
import com.example.movierecommendation.comment.dto.AdminCommentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminCommentService {

    Page<AdminCommentResponse> searchComments(Long movieId, String username, String keyword, Pageable pageable);

    void deleteComment(Long commentId);

    Page<AdminCommentReportResponse> getUnresolvedReports(Pageable pageable);

    Page<AdminCommentReportResponse> getResolvedReports(Pageable pageable);

    void resolveReport(Long reportId);

    void deleteReport(Long reportId);
}

