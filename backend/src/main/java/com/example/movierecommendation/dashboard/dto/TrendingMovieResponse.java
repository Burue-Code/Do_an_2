package com.example.movierecommendation.dashboard.dto;

public class TrendingMovieResponse {

    private Long movieId;
    private String title;
    private String poster;
    private Float ratingScore;
    private Integer ratingCount;
    private long watchCountRecent;

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
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

    public long getWatchCountRecent() {
        return watchCountRecent;
    }

    public void setWatchCountRecent(long watchCountRecent) {
        this.watchCountRecent = watchCountRecent;
    }
}

