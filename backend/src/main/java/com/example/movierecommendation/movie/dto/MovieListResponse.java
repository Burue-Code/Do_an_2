package com.example.movierecommendation.movie.dto;

public class MovieListResponse {

    private Long id;
    private String title;
    private String poster;
    private Float ratingScore;
    private Integer ratingCount;
    private String status;
    private Integer movieType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public Float getRatingScore() {
        return ratingScore;
    }

    public void setRatingScore(Float ratingScore) {
        this.ratingScore = ratingScore;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getMovieType() {
        return movieType;
    }

    public void setMovieType(Integer movieType) {
        this.movieType = movieType;
    }
}

