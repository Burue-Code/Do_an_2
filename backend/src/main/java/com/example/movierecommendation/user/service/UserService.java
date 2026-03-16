package com.example.movierecommendation.user.service;

import com.example.movierecommendation.user.dto.AdminUserResponse;

import java.util.List;

public interface UserService {

    List<AdminUserResponse> getAllForAdmin();

    void lockUser(Long userId);

    void unlockUser(Long userId);

    void changeRole(Long userId, String roleName);

    void deleteUserByAdmin(Long userId);
}

