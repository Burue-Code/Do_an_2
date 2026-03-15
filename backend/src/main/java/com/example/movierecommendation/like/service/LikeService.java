package com.example.movierecommendation.like.service;

import com.example.movierecommendation.like.dto.ToggleLikeResponse;

public interface LikeService {

    ToggleLikeResponse toggleLike(Long movieId);

    boolean isLiked(Long movieId);
}
