package com.example.movierecommendation.movie.dto;

import java.util.List;

public class MovieCastResponse {

    private List<CastMemberResponse> actors;
    private List<CastMemberResponse> directors;

    public List<CastMemberResponse> getActors() {
        return actors;
    }

    public void setActors(List<CastMemberResponse> actors) {
        this.actors = actors;
    }

    public List<CastMemberResponse> getDirectors() {
        return directors;
    }

    public void setDirectors(List<CastMemberResponse> directors) {
        this.directors = directors;
    }

    public static class CastMemberResponse {
        private Long id;
        private String fullName;
        private String characterName; // for actors: role; for directors: null

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getCharacterName() {
            return characterName;
        }

        public void setCharacterName(String characterName) {
            this.characterName = characterName;
        }
    }
}
