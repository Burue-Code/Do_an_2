package com.example.movierecommendation.comment.controller;

import com.example.movierecommendation.comment.dto.CommentResponse;
import com.example.movierecommendation.comment.dto.CreateCommentRequest;
import com.example.movierecommendation.comment.service.CommentService;
import com.example.movierecommendation.common.dto.BaseResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentMutationController {

    private final CommentService commentService;

    public CommentMutationController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<CommentResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.update(id, request);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<Void>> delete(@PathVariable Long id) {
        commentService.delete(id);
        return ResponseEntity.ok(BaseResponse.ok(null));
    }
}
