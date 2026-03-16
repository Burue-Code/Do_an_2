package com.example.movierecommendation.movie.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdminMovieRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @Size(max = 1000)
    private String description;

    private Integer releaseYear;

    private Integer duration;

    private String status;

    private Integer totalEpisodes;

    /**
     * 1 = phim lẻ, 2 = phim bộ
     */
    private Integer movieType;

    private String poster;

    private java.util.List<Long> genreIds;

    private java.util.List<Long> actorIds;

    private java.util.List<Long> directorIds;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTotalEpisodes() {
        return totalEpisodes;
    }

    public void setTotalEpisodes(Integer totalEpisodes) {
        this.totalEpisodes = totalEpisodes;
    }

    public Integer getMovieType() {
        return movieType;
    }

    public void setMovieType(Integer movieType) {
        this.movieType = movieType;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public java.util.List<Long> getGenreIds() {
        return genreIds;
    }

    public void setGenreIds(java.util.List<Long> genreIds) {
        this.genreIds = genreIds;
    }

    public java.util.List<Long> getActorIds() {
        return actorIds;
    }

    public void setActorIds(java.util.List<Long> actorIds) {
        this.actorIds = actorIds;
    }

    public java.util.List<Long> getDirectorIds() {
        return directorIds;
    }

    public void setDirectorIds(java.util.List<Long> directorIds) {
        this.directorIds = directorIds;
    }
}

