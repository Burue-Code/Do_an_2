package com.example.movierecommendation.user.controller;

import com.example.movierecommendation.auth.dto.FavoriteGenresRequest;
import com.example.movierecommendation.auth.service.AuthService;
import com.example.movierecommendation.common.dto.ApiMessage;
import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.user.dto.UserProfileResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
public class UserMeController {

    private final AuthService authService;

    public UserMeController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<UserProfileResponse>> getProfile() {
        UserProfileResponse profile = authService.getCurrentUserProfile();
        return ResponseEntity.ok(BaseResponse.ok(profile));
    }

    @PutMapping("/favorite-genres")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<ApiMessage>> setFavoriteGenres(@Valid @RequestBody FavoriteGenresRequest request) {
        authService.setFavoriteGenres(request.getGenreIds());
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Favorite genres updated")));
    }
}
