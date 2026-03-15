package com.example.movierecommendation.recommendation.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.recommendation.dto.RecommendationItemResponse;
import com.example.movierecommendation.recommendation.dto.RecommendationResponse;
import com.example.movierecommendation.recommendation.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/me")
    public ResponseEntity<BaseResponse<RecommendationResponse>> getMyRecommendations(
            @RequestParam(name = "limit", defaultValue = "20") int limit
    ) {
        Long userId = getCurrentUserId();
        List<RecommendationItemResponse> items = recommendationService.getRecommendationsForUser(userId, limit);
        RecommendationResponse response = new RecommendationResponse(items);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }

    @GetMapping("/home")
    public ResponseEntity<BaseResponse<RecommendationResponse>> getHomeRecommendations(
            @RequestParam(name = "limit", defaultValue = "20") int limit
    ) {
        Long userId = getCurrentUserIdOrNull();
        List<RecommendationItemResponse> items = recommendationService.getHomeRecommendations(userId, limit);
        RecommendationResponse response = new RecommendationResponse(items);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User must be authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.User) {
            // Ở đây giả định username là userId dạng số; nếu project dùng UserDetails custom,
            // RecommendationService có thể được chỉnh sửa sau cho phù hợp.
            String username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
            return Long.parseLong(username);
        }
        if (principal instanceof String) {
            return Long.parseLong((String) principal);
        }
        throw new IllegalStateException("Cannot extract user id from principal");
    }

    private Long getCurrentUserIdOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.User) {
            String username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
            return tryParseLong(username);
        }
        if (principal instanceof String) {
            return tryParseLong((String) principal);
        }
        return null;
    }

    private Long tryParseLong(String value) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}

