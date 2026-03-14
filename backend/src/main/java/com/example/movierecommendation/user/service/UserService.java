package com.example.movierecommendation.user.service;

public interface UserService {

    void lockUser(Long userId);

    void unlockUser(Long userId);

    void deleteUserByAdmin(Long userId);
}

