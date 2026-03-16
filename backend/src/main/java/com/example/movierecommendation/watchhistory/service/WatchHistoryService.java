package com.example.movierecommendation.watchhistory.service;

import com.example.movierecommendation.watchhistory.dto.ContinueWatchingResponse;
import com.example.movierecommendation.watchhistory.dto.SaveWatchLogRequest;

public interface WatchHistoryService {

    ContinueWatchingResponse getContinueWatching(int limit);

    void saveWatchLog(SaveWatchLogRequest request);
}
