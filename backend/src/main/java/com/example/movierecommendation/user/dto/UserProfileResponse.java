package com.example.movierecommendation.user.dto;

import java.util.List;

public class UserProfileResponse {

    private Long id;
    private String username;
    private String fullName;
    private String role;
    private String phoneNumber;
    private String email;
    private List<Long> favoriteGenreIds;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Long> getFavoriteGenreIds() {
        return favoriteGenreIds;
    }

    public void setFavoriteGenreIds(List<Long> favoriteGenreIds) {
        this.favoriteGenreIds = favoriteGenreIds;
    }
}

