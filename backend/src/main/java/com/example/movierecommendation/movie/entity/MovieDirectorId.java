package com.example.movierecommendation.movie.entity;

import java.io.Serializable;
import java.util.Objects;

public class MovieDirectorId implements Serializable {

    private Long movieId;
    private Long directorId;

    public MovieDirectorId() {
    }

    public MovieDirectorId(Long movieId, Long directorId) {
        this.movieId = movieId;
        this.directorId = directorId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public Long getDirectorId() {
        return directorId;
    }

    public void setDirectorId(Long directorId) {
        this.directorId = directorId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MovieDirectorId that = (MovieDirectorId) o;
        return Objects.equals(movieId, that.movieId) && Objects.equals(directorId, that.directorId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(movieId, directorId);
    }
}
