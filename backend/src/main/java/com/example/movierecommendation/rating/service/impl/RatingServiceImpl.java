package com.example.movierecommendation.rating.service.impl;

import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.repository.MovieRepository;
import com.example.movierecommendation.rating.dto.RateMovieRequest;
import com.example.movierecommendation.rating.dto.RatingSummaryResponse;
import com.example.movierecommendation.rating.entity.Rating;
import com.example.movierecommendation.rating.mapper.RatingMapper;
import com.example.movierecommendation.rating.repository.RatingRepository;
import com.example.movierecommendation.rating.service.RatingService;
import com.example.movierecommendation.security.SecurityUtils;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public RatingServiceImpl(RatingRepository ratingRepository,
                             MovieRepository movieRepository,
                             UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public RatingSummaryResponse rateMovie(Long movieId, RateMovieRequest request) {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalArgumentException("Authentication required"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found: " + movieId));

        Rating rating = ratingRepository.findByUserIdAndMovieId(user.getId(), movieId)
                .orElse(null);

        boolean isNew = (rating == null);
        if (rating == null) {
            rating = new Rating();
            rating.setUser(user);
            rating.setMovie(movie);
        }
        int oldValue = rating.getRatingValue() != null ? rating.getRatingValue() : 0;
        int newValue = request.getRatingValue();

        rating.setRatingValue(newValue);
        ratingRepository.save(rating);

        // Update movie rating_score and rating_count
        float currentScore = movie.getRatingScore() != null ? movie.getRatingScore() : 0f;
        int currentCount = movie.getRatingCount() != null ? movie.getRatingCount() : 0;

        float totalSum = currentScore * currentCount;
        if (isNew) {
            totalSum += newValue;
            currentCount += 1;
        } else {
            totalSum = totalSum - oldValue + newValue;
        }
        float newScore = currentCount > 0 ? totalSum / currentCount : 0f;

        movie.setRatingScore(newScore);
        movie.setRatingCount(currentCount);
        movieRepository.save(movie);

        return RatingMapper.toSummary(movie.getRatingScore(), movie.getRatingCount());
    }

    @Override
    @Transactional(readOnly = true)
    public RatingSummaryResponse getSummary(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found: " + movieId));
        return RatingMapper.toSummary(movie.getRatingScore(), movie.getRatingCount());
    }
}
