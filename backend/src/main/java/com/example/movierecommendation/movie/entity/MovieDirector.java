package com.example.movierecommendation.movie.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "movies_directors")
@IdClass(MovieDirectorId.class)
public class MovieDirector {

    @Id
    @Column(name = "movie_id")
    private Long movieId;

    @Id
    @Column(name = "director_id")
    private Long directorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", insertable = false, updatable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "director_id", insertable = false, updatable = false)
    private Director director;

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

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public Director getDirector() {
        return director;
    }

    public void setDirector(Director director) {
        this.director = director;
    }
}
