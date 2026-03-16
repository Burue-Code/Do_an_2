package com.example.movierecommendation.user.mapper;

import com.example.movierecommendation.user.dto.AdminUserResponse;
import com.example.movierecommendation.user.dto.UserProfileResponse;
import com.example.movierecommendation.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public AdminUserResponse toAdminUserResponse(User user) {
        if (user == null) {
            return null;
        }
        AdminUserResponse r = new AdminUserResponse();
        r.setId(user.getId());
        r.setUsername(user.getUsername());
        r.setFullName(user.getFullName());
        r.setRole(user.getRole() != null ? user.getRole().getName() : null);
        r.setLocked(user.isLocked());
        return r;
    }

    public List<AdminUserResponse> toAdminUserResponseList(List<User> users) {
        if (users == null) {
            return List.of();
        }
        return users.stream().map(this::toAdminUserResponse).collect(Collectors.toList());
    }

    public UserProfileResponse toUserProfileResponse(User user) {
        if (user == null) {
            return null;
        }
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole() != null ? user.getRole().getName() : null);
        response.setPhoneNumber(user.getPhoneNumber());
        response.setEmail(user.getEmail());
        return response;
    }
}

