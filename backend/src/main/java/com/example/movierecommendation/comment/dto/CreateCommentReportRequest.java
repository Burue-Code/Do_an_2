package com.example.movierecommendation.comment.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateCommentReportRequest {

    @NotBlank
    private String reason;

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}

