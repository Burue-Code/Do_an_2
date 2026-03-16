package com.example.movierecommendation.movie.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.common.dto.PageResponse;
import com.example.movierecommendation.movie.dto.EpisodeResponse;
import com.example.movierecommendation.movie.dto.MovieCastResponse;
import com.example.movierecommendation.movie.dto.MovieDetailResponse;
import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.movie.entity.Episode;
import com.example.movierecommendation.movie.entity.MovieActor;
import com.example.movierecommendation.movie.entity.MovieDirector;
import com.example.movierecommendation.movie.repository.EpisodeRepository;
import com.example.movierecommendation.movie.repository.MovieActorRepository;
import com.example.movierecommendation.movie.repository.MovieDirectorRepository;
import com.example.movierecommendation.movie.service.MovieQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private static final Logger log = LoggerFactory.getLogger(MovieController.class);
    private final MovieQueryService movieQueryService;
    private final EpisodeRepository episodeRepository;
    private final MovieActorRepository movieActorRepository;
    private final MovieDirectorRepository movieDirectorRepository;

    public MovieController(MovieQueryService movieQueryService, EpisodeRepository episodeRepository,
                           MovieActorRepository movieActorRepository, MovieDirectorRepository movieDirectorRepository) {
        this.movieQueryService = movieQueryService;
        this.episodeRepository = episodeRepository;
        this.movieActorRepository = movieActorRepository;
        this.movieDirectorRepository = movieDirectorRepository;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<PageResponse<MovieListResponse>>> getMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long genreId,
            @RequestParam(value = "movieType", required = false) Integer movieType,
            @RequestParam(value = "sort", required = false) String sort
    ) {
        log.debug("getMovies: movieType={}, sort={}, keyword={}, genreId={}", movieType, sort, keyword, genreId);
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieListResponse> result = movieQueryService.searchMovies(keyword, genreId, movieType, sort, pageable);
        return ResponseEntity.ok(BaseResponse.ok(PageResponse.of(result)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<MovieDetailResponse>> getMovieDetail(@PathVariable Long id) {
        MovieDetailResponse response = movieQueryService.getMovieDetail(id);
        return ResponseEntity.ok(BaseResponse.ok(response));
    }

    @GetMapping("/{id}/episodes")
    public ResponseEntity<BaseResponse<List<EpisodeResponse>>> getEpisodes(@PathVariable Long id) {
        List<Episode> episodes = episodeRepository.findByMovie_IdOrderByEpisodeNumberAsc(id);
        List<EpisodeResponse> list = episodes.stream()
                .map(e -> {
                    EpisodeResponse dto = new EpisodeResponse();
                    dto.setId(e.getId());
                    dto.setEpisodeNumber(e.getEpisodeNumber());
                    dto.setVideoUrl(e.getVideoUrl());
                    dto.setReleaseTime(e.getReleaseTime());
                    dto.setDurationMinutes(e.getDurationMinutes());
                    return dto;
                })
                .toList();
        return ResponseEntity.ok(BaseResponse.ok(list));
    }

    @GetMapping("/{id}/cast")
    public ResponseEntity<BaseResponse<MovieCastResponse>> getCast(@PathVariable Long id) {
        MovieCastResponse response = new MovieCastResponse();
        response.setActors(movieActorRepository.findByMovieId(id).stream()
                .map(ma -> {
                    MovieCastResponse.CastMemberResponse m = new MovieCastResponse.CastMemberResponse();
                    m.setId(ma.getActor().getId());
                    m.setFullName(ma.getActor().getFullName());
                    m.setCharacterName(ma.getCharacterName());
                    return m;
                })
                .toList());
        response.setDirectors(movieDirectorRepository.findByMovieId(id).stream()
                .map(md -> {
                    MovieCastResponse.CastMemberResponse m = new MovieCastResponse.CastMemberResponse();
                    m.setId(md.getDirector().getId());
                    m.setFullName(md.getDirector().getFullName());
                    return m;
                })
                .toList());
        return ResponseEntity.ok(BaseResponse.ok(response));
    }

    @GetMapping("/top")
    public ResponseEntity<BaseResponse<List<MovieListResponse>>> getTop(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(BaseResponse.ok(movieQueryService.getTopRated(limit)));
    }

    @GetMapping("/new")
    public ResponseEntity<BaseResponse<List<MovieListResponse>>> getNew(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(BaseResponse.ok(movieQueryService.getNewest(limit)));
    }

    @GetMapping("/trending")
    public ResponseEntity<BaseResponse<List<MovieListResponse>>> getTrending(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(BaseResponse.ok(movieQueryService.getTrending(limit)));
    }
}

