package com.example.movierecommendation.comment.controller;

import com.example.movierecommendation.comment.dto.CommentResponse;
import com.example.movierecommendation.comment.dto.CreateCommentRequest;
import com.example.movierecommendation.comment.service.CommentService;
import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.common.dto.PageResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies/{movieId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<PageResponse<CommentResponse>>> getComments(
            @PathVariable Long movieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CommentResponse> result = commentService.getCommentsByMovieId(movieId, pageable);
        return ResponseEntity.ok(BaseResponse.ok(PageResponse.of(result)));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<CommentResponse>> create(
            @PathVariable Long movieId,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.create(movieId, request);
        return ResponseEntity.status(201).body(BaseResponse.ok(response));
    }
}
