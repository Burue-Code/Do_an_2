package com.example.movierecommendation.user.dto;

import jakarta.validation.constraints.NotBlank;

public class ChangeRoleRequest {

    @NotBlank(message = "Role không được để trống")
    private String role;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
