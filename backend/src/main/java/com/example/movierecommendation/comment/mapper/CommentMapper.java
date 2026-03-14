package com.example.movierecommendation.comment.mapper;

import com.example.movierecommendation.comment.dto.CommentResponse;
import com.example.movierecommendation.comment.entity.Comment;

public final class CommentMapper {

    private CommentMapper() {
    }

    public static CommentResponse toResponse(Comment entity) {
        if (entity == null) return null;
        CommentResponse dto = new CommentResponse();
        dto.setId(entity.getId());
        dto.setContent(entity.getContent());
        dto.setCreatedAt(entity.getCreatedAt());
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setUsername(entity.getUser().getUsername());
        }
        return dto;
    }
}
