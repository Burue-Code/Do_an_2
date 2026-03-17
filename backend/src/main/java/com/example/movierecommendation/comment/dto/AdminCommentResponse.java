package com.example.movierecommendation.comment.dto;

import java.time.LocalDateTime;

public class AdminCommentResponse {

    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long userId;
    private String username;
    private String content;
    private LocalDateTime createdAt;
    private Long unresolvedReportsCount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUnresolvedReportsCount() {
        return unresolvedReportsCount;
    }

    public void setUnresolvedReportsCount(Long unresolvedReportsCount) {
        this.unresolvedReportsCount = unresolvedReportsCount;
    }
}

