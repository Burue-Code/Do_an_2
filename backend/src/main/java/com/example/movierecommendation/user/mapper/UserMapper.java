package com.example.movierecommendation.user.mapper;

import com.example.movierecommendation.user.dto.UserProfileResponse;
import com.example.movierecommendation.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserProfileResponse toUserProfileResponse(User user) {
        if (user == null) {
            return null;
        }
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole() != null ? user.getRole().getName() : null);
        return response;
    }
}

