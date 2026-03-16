package com.example.movierecommendation.watchlist.dto;

public class WatchlistToggleResponse {

    private boolean inWatchlist;

    public WatchlistToggleResponse() {
    }

    public WatchlistToggleResponse(boolean inWatchlist) {
        this.inWatchlist = inWatchlist;
    }

    public boolean isInWatchlist() {
        return inWatchlist;
    }

    public void setInWatchlist(boolean inWatchlist) {
        this.inWatchlist = inWatchlist;
    }
}

