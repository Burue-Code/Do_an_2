package com.example.movierecommendation.like.dto;

public class ToggleLikeResponse {

    private boolean liked;

    public ToggleLikeResponse() {
    }

    public ToggleLikeResponse(boolean liked) {
        this.liked = liked;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }
}
