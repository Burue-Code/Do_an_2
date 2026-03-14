package com.example.movierecommendation.like.service.impl;

import com.example.movierecommendation.like.dto.ToggleLikeResponse;
import com.example.movierecommendation.like.entity.MovieLike;
import com.example.movierecommendation.like.repository.MovieLikeRepository;
import com.example.movierecommendation.like.service.LikeService;
import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.repository.MovieRepository;
import com.example.movierecommendation.security.SecurityUtils;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikeServiceImpl implements LikeService {

    private final MovieLikeRepository movieLikeRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public LikeServiceImpl(MovieLikeRepository movieLikeRepository,
                           MovieRepository movieRepository,
                           UserRepository userRepository) {
        this.movieLikeRepository = movieLikeRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ToggleLikeResponse toggleLike(Long movieId) {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Authentication required"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found: " + movieId));

        var existing = movieLikeRepository.findByUserIdAndMovieId(user.getId(), movieId);

        if (existing.isPresent()) {
            movieLikeRepository.delete(existing.get());
            return new ToggleLikeResponse(false);
        } else {
            MovieLike like = new MovieLike();
            like.setId(new MovieLike.MovieLikeId(user.getId(), movieId));
            like.setUser(user);
            like.setMovie(movie);
            movieLikeRepository.save(like);
            return new ToggleLikeResponse(true);
        }
    }
}
