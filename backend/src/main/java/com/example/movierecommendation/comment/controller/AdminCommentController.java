package com.example.movierecommendation.comment.controller;

import com.example.movierecommendation.comment.dto.AdminCommentReportResponse;
import com.example.movierecommendation.comment.dto.AdminCommentResponse;
import com.example.movierecommendation.comment.service.AdminCommentService;
import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.common.dto.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/comments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCommentController {

    private final AdminCommentService adminCommentService;

    public AdminCommentController(AdminCommentService adminCommentService) {
        this.adminCommentService = adminCommentService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<PageResponse<AdminCommentResponse>>> search(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminCommentResponse> result = adminCommentService.searchComments(movieId, username, keyword, pageable);
        return ResponseEntity.ok(BaseResponse.ok(PageResponse.of(result)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> delete(@PathVariable Long id) {
        adminCommentService.deleteComment(id);
        return ResponseEntity.ok(BaseResponse.ok(null));
    }

    @GetMapping("/reports")
    public ResponseEntity<BaseResponse<PageResponse<AdminCommentReportResponse>>> getUnresolvedReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminCommentReportResponse> result = adminCommentService.getUnresolvedReports(pageable);
        return ResponseEntity.ok(BaseResponse.ok(PageResponse.of(result)));
    }

    @GetMapping("/reports/resolved")
    public ResponseEntity<BaseResponse<PageResponse<AdminCommentReportResponse>>> getResolvedReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminCommentReportResponse> result = adminCommentService.getResolvedReports(pageable);
        return ResponseEntity.ok(BaseResponse.ok(PageResponse.of(result)));
    }

    @PutMapping("/reports/{reportId}/resolve")
    public ResponseEntity<BaseResponse<Void>> resolve(@PathVariable Long reportId) {
        adminCommentService.resolveReport(reportId);
        return ResponseEntity.ok(BaseResponse.ok(null));
    }

    @DeleteMapping("/reports/{reportId}")
    public ResponseEntity<BaseResponse<Void>> deleteReport(@PathVariable Long reportId) {
        adminCommentService.deleteReport(reportId);
        return ResponseEntity.ok(BaseResponse.ok(null));
    }
}

