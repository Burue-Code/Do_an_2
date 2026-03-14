package com.example.movierecommendation.like.entity;

import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.user.entity.User;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
public class MovieLike {

    @EmbeddedId
    private MovieLikeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("movieId")
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public MovieLikeId getId() {
        return id;
    }

    public void setId(MovieLikeId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Embeddable
    public static class MovieLikeId implements Serializable {

        private Long userId;
        private Long movieId;

        public MovieLikeId() {
        }

        public MovieLikeId(Long userId, Long movieId) {
            this.userId = userId;
            this.movieId = movieId;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Long getMovieId() {
            return movieId;
        }

        public void setMovieId(Long movieId) {
            this.movieId = movieId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            MovieLikeId that = (MovieLikeId) o;
            return java.util.Objects.equals(userId, that.userId) && java.util.Objects.equals(movieId, that.movieId);
        }

        @Override
        public int hashCode() {
            return java.util.Objects.hash(userId, movieId);
        }
    }
}
