package com.example.movierecommendation.movie.dto;

public class AdminMovieStatsResponse {

    private long likesCount;
    private long commentsCount;
    private long ratingsCount;
    private float averageRating;
    private long watchLogsCount;
    private long completedViewsCount;

    public long getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(long likesCount) {
        this.likesCount = likesCount;
    }

    public long getCommentsCount() {
        return commentsCount;
    }

    public void setCommentsCount(long commentsCount) {
        this.commentsCount = commentsCount;
    }

    public long getRatingsCount() {
        return ratingsCount;
    }

    public void setRatingsCount(long ratingsCount) {
        this.ratingsCount = ratingsCount;
    }

    public float getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(float averageRating) {
        this.averageRating = averageRating;
    }

    public long getWatchLogsCount() {
        return watchLogsCount;
    }

    public void setWatchLogsCount(long watchLogsCount) {
        this.watchLogsCount = watchLogsCount;
    }

    public long getCompletedViewsCount() {
        return completedViewsCount;
    }

    public void setCompletedViewsCount(long completedViewsCount) {
        this.completedViewsCount = completedViewsCount;
    }
}

