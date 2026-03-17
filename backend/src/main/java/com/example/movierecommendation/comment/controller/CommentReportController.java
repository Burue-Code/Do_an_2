package com.example.movierecommendation.comment.controller;

import com.example.movierecommendation.comment.dto.CreateCommentReportRequest;
import com.example.movierecommendation.comment.entity.Comment;
import com.example.movierecommendation.comment.entity.CommentReport;
import com.example.movierecommendation.comment.repository.CommentReportRepository;
import com.example.movierecommendation.comment.repository.CommentRepository;
import com.example.movierecommendation.common.dto.ApiMessage;
import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.common.exception.NotFoundException;
import com.example.movierecommendation.security.SecurityUtils;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentReportController {

    private final CommentRepository commentRepository;
    private final CommentReportRepository commentReportRepository;
    private final UserRepository userRepository;

    public CommentReportController(CommentRepository commentRepository,
                                   CommentReportRepository commentReportRepository,
                                   UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.commentReportRepository = commentReportRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{id}/report")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<ApiMessage>> report(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentReportRequest request
    ) {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalStateException("Yêu cầu đăng nhập."));
        User reporter = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng."));
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy bình luận với id: " + id));

        CommentReport existing = commentReportRepository
                .findByComment_IdAndReporter_Id(comment.getId(), reporter.getId())
                .orElse(null);
        if (existing != null) {
            return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Bình luận này đã được bạn báo cáo trước đó.")));
        }

        CommentReport r = new CommentReport();
        r.setComment(comment);
        r.setReporter(reporter);
        r.setReason(request.getReason().trim());
        commentReportRepository.save(r);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Đã gửi báo cáo bình luận.")));
    }
}

