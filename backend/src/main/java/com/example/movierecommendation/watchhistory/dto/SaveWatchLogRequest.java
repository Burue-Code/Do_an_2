package com.example.movierecommendation.watchhistory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SaveWatchLogRequest {

    @NotNull
    private Long movieId;

    private Long episodeId;

    @NotNull
    @Min(0)
    private Integer durationWatched;

    private Boolean completed;

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public Long getEpisodeId() {
        return episodeId;
    }

    public void setEpisodeId(Long episodeId) {
        this.episodeId = episodeId;
    }

    public Integer getDurationWatched() {
        return durationWatched;
    }

    public void setDurationWatched(Integer durationWatched) {
        this.durationWatched = durationWatched;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}

