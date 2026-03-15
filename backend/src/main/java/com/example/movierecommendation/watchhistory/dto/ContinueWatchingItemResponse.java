package com.example.movierecommendation.watchhistory.dto;

import com.example.movierecommendation.movie.dto.MovieListResponse;

public class ContinueWatchingItemResponse {

    private MovieListResponse movie;
    private Integer progressPercent;
    private Integer episodeNumber;

    public MovieListResponse getMovie() {
        return movie;
    }

    public void setMovie(MovieListResponse movie) {
        this.movie = movie;
    }

    public Integer getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(Integer progressPercent) {
        this.progressPercent = progressPercent;
    }

    public Integer getEpisodeNumber() {
        return episodeNumber;
    }

    public void setEpisodeNumber(Integer episodeNumber) {
        this.episodeNumber = episodeNumber;
    }
}
