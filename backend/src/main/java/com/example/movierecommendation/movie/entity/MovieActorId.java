package com.example.movierecommendation.movie.entity;

import java.io.Serializable;
import java.util.Objects;

public class MovieActorId implements Serializable {

    private Long movieId;
    private Long actorId;

    public MovieActorId() {
    }

    public MovieActorId(Long movieId, Long actorId) {
        this.movieId = movieId;
        this.actorId = actorId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public Long getActorId() {
        return actorId;
    }

    public void setActorId(Long actorId) {
        this.actorId = actorId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MovieActorId that = (MovieActorId) o;
        return Objects.equals(movieId, that.movieId) && Objects.equals(actorId, that.actorId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(movieId, actorId);
    }
}
