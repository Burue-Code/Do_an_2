package com.example.movierecommendation.movie.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "movies_actors")
@IdClass(MovieActorId.class)
public class MovieActor {

    @Id
    @Column(name = "movie_id")
    private Long movieId;

    @Id
    @Column(name = "actor_id")
    private Long actorId;

    @Column(name = "character_name", length = 200)
    private String characterName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", insertable = false, updatable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "actor_id", insertable = false, updatable = false)
    private Actor actor;

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

    public String getCharacterName() {
        return characterName;
    }

    public void setCharacterName(String characterName) {
        this.characterName = characterName;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public Actor getActor() {
        return actor;
    }

    public void setActor(Actor actor) {
        this.actor = actor;
    }
}
