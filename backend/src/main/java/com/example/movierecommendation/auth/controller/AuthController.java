package com.example.movierecommendation.auth.controller;

import com.example.movierecommendation.auth.dto.AuthResponse;
import com.example.movierecommendation.auth.dto.ChangePasswordRequest;
import com.example.movierecommendation.auth.dto.LoginRequest;
import com.example.movierecommendation.auth.dto.RegisterRequest;
import com.example.movierecommendation.auth.service.AuthService;
import com.example.movierecommendation.common.dto.ApiMessage;
import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.user.dto.UserProfileResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<BaseResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }

    @GetMapping("/me")
    public ResponseEntity<BaseResponse<UserProfileResponse>> me() {
        UserProfileResponse profile = authService.getCurrentUserProfile();
        return ResponseEntity.ok(BaseResponse.ok(profile));
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<ApiMessage>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Password updated")));
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<ApiMessage>> logout() {
        // Stateless JWT: frontend chỉ cần xoá token, ở server trả 200 OK
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Logged out")));
    }
}

