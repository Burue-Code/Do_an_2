package com.example.movierecommendation.dashboard.dto;

public class DashboardOverviewResponse {

    private long totalUsers;
    private long totalMovies;
    private long totalComments;
    private long totalRatings;
    private long totalLikes;
    private long totalWatchlistItems;
    private long totalWatchLogs;

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalMovies() {
        return totalMovies;
    }

    public void setTotalMovies(long totalMovies) {
        this.totalMovies = totalMovies;
    }

    public long getTotalComments() {
        return totalComments;
    }

    public void setTotalComments(long totalComments) {
        this.totalComments = totalComments;
    }

    public long getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(long totalRatings) {
        this.totalRatings = totalRatings;
    }

    public long getTotalLikes() {
        return totalLikes;
    }

    public void setTotalLikes(long totalLikes) {
        this.totalLikes = totalLikes;
    }

    public long getTotalWatchlistItems() {
        return totalWatchlistItems;
    }

    public void setTotalWatchlistItems(long totalWatchlistItems) {
        this.totalWatchlistItems = totalWatchlistItems;
    }

    public long getTotalWatchLogs() {
        return totalWatchLogs;
    }

    public void setTotalWatchLogs(long totalWatchLogs) {
        this.totalWatchLogs = totalWatchLogs;
    }
}

