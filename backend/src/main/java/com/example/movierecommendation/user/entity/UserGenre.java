package com.example.movierecommendation.user.entity;

import com.example.movierecommendation.genre.entity.Genre;
import jakarta.persistence.*;

@Entity
@Table(name = "users_genre")
public class UserGenre {

    @EmbeddedId
    private UserGenreId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("genreId")
    @JoinColumn(name = "genre_id", nullable = false)
    private Genre genre;

    public UserGenreId getId() {
        return id;
    }

    public void setId(UserGenreId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Genre getGenre() {
        return genre;
    }

    public void setGenre(Genre genre) {
        this.genre = genre;
    }
}
