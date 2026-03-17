package com.example.movierecommendation.recommendation.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.recommendation.dto.RecommendationItemResponse;
import com.example.movierecommendation.recommendation.dto.RecommendationResponse;
import com.example.movierecommendation.recommendation.service.RecommendationService;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    public RecommendationController(RecommendationService recommendationService,
                                    UserRepository userRepository) {
        this.recommendationService = recommendationService;
        this.userRepository = userRepository;
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
        Long userId = getCurrentUserIdOrNull();
        if (userId == null) {
            throw new IllegalStateException("User must be authenticated");
        }
        return userId;
    }

    private Long getCurrentUserIdOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        String username = null;

        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            username = (String) principal;
        }

        if (username == null || username.isBlank()) {
            return null;
        }

        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElse(null);
    }
}

