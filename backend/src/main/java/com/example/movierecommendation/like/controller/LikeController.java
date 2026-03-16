package com.example.movierecommendation.like.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.like.dto.ToggleLikeResponse;
import com.example.movierecommendation.like.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies/{movieId}/like")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<ToggleLikeResponse>> getStatus(@PathVariable Long movieId) {
        boolean liked = likeService.isLiked(movieId);
        return ResponseEntity.ok(BaseResponse.ok(new ToggleLikeResponse(liked)));
    }

    @PostMapping("/toggle")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<ToggleLikeResponse>> toggle(@PathVariable Long movieId) {
        ToggleLikeResponse response = likeService.toggleLike(movieId);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }
}
