package com.example.movierecommendation.watchhistory.dto;

import java.util.List;

public class ContinueWatchingResponse {

    private List<ContinueWatchingItemResponse> items;

    public List<ContinueWatchingItemResponse> getItems() {
        return items;
    }

    public void setItems(List<ContinueWatchingItemResponse> items) {
        this.items = items;
    }
}
