package com.example.movierecommendation.comment.service;

import com.example.movierecommendation.comment.dto.CommentResponse;
import com.example.movierecommendation.comment.dto.CreateCommentRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {

    Page<CommentResponse> getCommentsByMovieId(Long movieId, Pageable pageable);

    CommentResponse create(Long movieId, CreateCommentRequest request);

    CommentResponse update(Long id, CreateCommentRequest request);

    void delete(Long id);
}
