package com.example.movierecommendation.auth.service;

import com.example.movierecommendation.auth.dto.AuthResponse;
import com.example.movierecommendation.auth.dto.ChangePasswordRequest;
import com.example.movierecommendation.auth.dto.LoginRequest;
import com.example.movierecommendation.auth.dto.RegisterRequest;
import com.example.movierecommendation.user.dto.UserProfileResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    void changePassword(ChangePasswordRequest request);

    UserProfileResponse getCurrentUserProfile();
}

