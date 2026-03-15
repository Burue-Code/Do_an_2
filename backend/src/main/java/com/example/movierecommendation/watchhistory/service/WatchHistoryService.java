package com.example.movierecommendation.watchhistory.service;

import com.example.movierecommendation.watchhistory.dto.ContinueWatchingResponse;

public interface WatchHistoryService {

    ContinueWatchingResponse getContinueWatching(int limit);
}
