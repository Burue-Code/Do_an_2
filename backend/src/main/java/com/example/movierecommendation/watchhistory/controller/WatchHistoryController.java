package com.example.movierecommendation.watchhistory.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.watchhistory.dto.ContinueWatchingResponse;
import com.example.movierecommendation.watchhistory.service.WatchHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
public class WatchHistoryController {

    private final WatchHistoryService watchHistoryService;

    public WatchHistoryController(WatchHistoryService watchHistoryService) {
        this.watchHistoryService = watchHistoryService;
    }

    @GetMapping("/continue-watching")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BaseResponse<ContinueWatchingResponse>> getContinueWatching(
            @RequestParam(defaultValue = "10") int limit) {
        ContinueWatchingResponse response = watchHistoryService.getContinueWatching(limit);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }
}