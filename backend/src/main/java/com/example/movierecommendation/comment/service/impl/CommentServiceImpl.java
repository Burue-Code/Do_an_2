package com.example.movierecommendation.comment.service.impl;

import com.example.movierecommendation.comment.dto.CommentResponse;
import com.example.movierecommendation.comment.dto.CreateCommentRequest;
import com.example.movierecommendation.comment.entity.Comment;
import com.example.movierecommendation.comment.mapper.CommentMapper;
import com.example.movierecommendation.comment.repository.CommentRepository;
import com.example.movierecommendation.comment.service.CommentService;
import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.repository.MovieRepository;
import com.example.movierecommendation.security.SecurityUtils;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public CommentServiceImpl(CommentRepository commentRepository,
                              MovieRepository movieRepository,
                              UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentResponse> getCommentsByMovieId(Long movieId, Pageable pageable) {
        if (!movieRepository.existsById(movieId)) {
            throw new IllegalArgumentException("Movie not found: " + movieId);
        }
        return commentRepository.findByMovieIdOrderByCreatedAtDesc(movieId, pageable)
                .map(CommentMapper::toResponse);
    }

    @Override
    @Transactional
    public CommentResponse create(Long movieId, CreateCommentRequest request) {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Authentication required"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found: " + movieId));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setMovie(movie);
        comment.setContent(request.getContent().trim());
        comment = commentRepository.save(comment);
        return CommentMapper.toResponse(comment);
    }

    @Override
    @Transactional
    public CommentResponse update(Long id, CreateCommentRequest request) {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Authentication required"));
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + id));
        if (!comment.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("Not authorized to update this comment");
        }
        comment.setContent(request.getContent().trim());
        comment = commentRepository.save(comment);
        return CommentMapper.toResponse(comment);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Authentication required"));
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + id));
        if (!comment.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("Not authorized to delete this comment");
        }
        commentRepository.delete(comment);
    }
}
