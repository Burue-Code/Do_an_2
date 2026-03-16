package com.example.movierecommendation.movie.controller;

import com.example.movierecommendation.common.dto.ApiMessage;
import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.movie.dto.AdminMovieRequest;
import com.example.movierecommendation.movie.dto.AdminEpisodeRequest;
import com.example.movierecommendation.movie.dto.EpisodeResponse;
import com.example.movierecommendation.movie.dto.ScheduleResponse;
import com.example.movierecommendation.movie.dto.AdminScheduleRequest;
import com.example.movierecommendation.movie.dto.AdminMovieStatsResponse;
import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.entity.Episode;
import com.example.movierecommendation.movie.entity.Schedule;
import com.example.movierecommendation.genre.entity.Genre;
import com.example.movierecommendation.genre.repository.GenreRepository;
import com.example.movierecommendation.movie.entity.Actor;
import com.example.movierecommendation.movie.entity.Director;
import com.example.movierecommendation.movie.entity.MovieActor;
import com.example.movierecommendation.movie.entity.MovieActorId;
import com.example.movierecommendation.movie.entity.MovieDirector;
import com.example.movierecommendation.movie.entity.MovieDirectorId;
import com.example.movierecommendation.movie.entity.MovieGenre;
import com.example.movierecommendation.movie.entity.MovieGenreId;
import com.example.movierecommendation.movie.repository.ActorRepository;
import com.example.movierecommendation.movie.repository.DirectorRepository;
import com.example.movierecommendation.movie.repository.MovieActorRepository;
import com.example.movierecommendation.movie.repository.MovieDirectorRepository;
import com.example.movierecommendation.movie.repository.MovieGenreRepository;
import com.example.movierecommendation.movie.repository.MovieRepository;
import com.example.movierecommendation.movie.repository.EpisodeRepository;
import com.example.movierecommendation.movie.repository.ScheduleRepository;
import com.example.movierecommendation.comment.repository.CommentRepository;
import com.example.movierecommendation.like.repository.MovieLikeRepository;
import com.example.movierecommendation.rating.repository.RatingRepository;
import com.example.movierecommendation.watchhistory.repository.WatchLogRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/movies")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMovieController {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final MovieGenreRepository movieGenreRepository;
    private final ActorRepository actorRepository;
    private final DirectorRepository directorRepository;
    private final MovieActorRepository movieActorRepository;
    private final MovieDirectorRepository movieDirectorRepository;
    private final CommentRepository commentRepository;
    private final MovieLikeRepository movieLikeRepository;
    private final RatingRepository ratingRepository;
    private final WatchLogRepository watchLogRepository;
    private final EpisodeRepository episodeRepository;
    private final ScheduleRepository scheduleRepository;

    public AdminMovieController(MovieRepository movieRepository,
                                GenreRepository genreRepository,
                                MovieGenreRepository movieGenreRepository,
                                ActorRepository actorRepository,
                                DirectorRepository directorRepository,
                                MovieActorRepository movieActorRepository,
                                MovieDirectorRepository movieDirectorRepository,
                                CommentRepository commentRepository,
                                MovieLikeRepository movieLikeRepository,
                                RatingRepository ratingRepository,
                                WatchLogRepository watchLogRepository,
                                EpisodeRepository episodeRepository,
                                ScheduleRepository scheduleRepository) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.movieGenreRepository = movieGenreRepository;
        this.actorRepository = actorRepository;
        this.directorRepository = directorRepository;
        this.movieActorRepository = movieActorRepository;
        this.movieDirectorRepository = movieDirectorRepository;
        this.commentRepository = commentRepository;
        this.movieLikeRepository = movieLikeRepository;
        this.ratingRepository = ratingRepository;
        this.watchLogRepository = watchLogRepository;
        this.episodeRepository = episodeRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @PostMapping
    public ResponseEntity<BaseResponse<ApiMessage>> createMovie(@Valid @RequestBody AdminMovieRequest request) {
        Movie movie = new Movie();
        applyRequestToEntity(request, movie);
        movieRepository.save(movie);
        applyRelations(request, movie);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Movie created")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<ApiMessage>> updateMovie(@PathVariable Long id,
                                                                @Valid @RequestBody AdminMovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        applyRequestToEntity(request, movie);
        movieRepository.save(movie);
        applyRelations(request, movie);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Movie updated")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<ApiMessage>> deleteMovie(@PathVariable Long id) {
        if (!movieRepository.existsById(id)) {
            throw new IllegalArgumentException("Movie not found");
        }
        movieRepository.deleteById(id);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Movie deleted")));
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<BaseResponse<AdminMovieStatsResponse>> getMovieStats(@PathVariable Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        AdminMovieStatsResponse resp = new AdminMovieStatsResponse();
        resp.setCommentsCount(commentRepository.countByMovieId(id));
        resp.setLikesCount(movieLikeRepository.countById_MovieId(id));
        resp.setRatingsCount(ratingRepository.countByMovieId(id));
        resp.setAverageRating(movie.getRatingScore() != null ? movie.getRatingScore() : 0f);
        resp.setWatchLogsCount(watchLogRepository.countByMovie_Id(id));
        resp.setCompletedViewsCount(watchLogRepository.countByMovie_IdAndCompletedTrue(id));

        return ResponseEntity.ok(BaseResponse.ok(resp));
    }

    @GetMapping("/{id}/episodes")
    public ResponseEntity<BaseResponse<java.util.List<EpisodeResponse>>> getAdminEpisodes(@PathVariable Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        java.util.List<Episode> episodes = episodeRepository.findByMovie_IdOrderByEpisodeNumberAsc(movie.getId());
        java.util.List<EpisodeResponse> list = episodes.stream().map(e -> {
            EpisodeResponse dto = new EpisodeResponse();
            dto.setId(e.getId());
            dto.setEpisodeNumber(e.getEpisodeNumber());
            dto.setVideoUrl(e.getVideoUrl());
            dto.setReleaseTime(e.getReleaseTime());
            dto.setDurationMinutes(e.getDurationMinutes());
            return dto;
        }).toList();
        return ResponseEntity.ok(BaseResponse.ok(list));
    }

    @PostMapping("/{id}/episodes")
    public ResponseEntity<BaseResponse<ApiMessage>> createEpisode(@PathVariable Long id,
                                                                  @Valid @RequestBody AdminEpisodeRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        Episode episode = new Episode();
        episode.setMovie(movie);
        episode.setEpisodeNumber(request.getEpisodeNumber());
        episode.setVideoUrl(request.getVideoUrl());
        episode.setReleaseTime(request.getReleaseTime());
        episodeRepository.save(episode);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Episode created")));
    }

    @PutMapping("/episodes/{episodeId}")
    public ResponseEntity<BaseResponse<ApiMessage>> updateEpisode(@PathVariable Long episodeId,
                                                                  @Valid @RequestBody AdminEpisodeRequest request) {
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() -> new IllegalArgumentException("Episode not found"));
        episode.setEpisodeNumber(request.getEpisodeNumber());
        episode.setVideoUrl(request.getVideoUrl());
        episode.setReleaseTime(request.getReleaseTime());
        episodeRepository.save(episode);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Episode updated")));
    }

    @DeleteMapping("/episodes/{episodeId}")
    public ResponseEntity<BaseResponse<ApiMessage>> deleteEpisode(@PathVariable Long episodeId) {
        if (!episodeRepository.existsById(episodeId)) {
            throw new IllegalArgumentException("Episode not found");
        }
        episodeRepository.deleteById(episodeId);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Episode deleted")));
    }

    @GetMapping("/{id}/schedules")
    public ResponseEntity<BaseResponse<java.util.List<ScheduleResponse>>> getSchedules(@PathVariable Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        java.util.List<Schedule> schedules = scheduleRepository.findByMovie_IdOrderByIdAsc(movie.getId());
        java.util.List<ScheduleResponse> list = schedules.stream().map(s -> {
            ScheduleResponse dto = new ScheduleResponse();
            dto.setId(s.getId());
            dto.setDayOfWeek(s.getDayOfWeek());
            dto.setAirTime(s.getAirTime());
            dto.setNote(s.getNote());
            return dto;
        }).toList();
        return ResponseEntity.ok(BaseResponse.ok(list));
    }

    @PostMapping("/{id}/schedules")
    public ResponseEntity<BaseResponse<ApiMessage>> createSchedule(@PathVariable Long id,
                                                                   @Valid @RequestBody AdminScheduleRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        Schedule schedule = new Schedule();
        schedule.setMovie(movie);
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setAirTime(request.getAirTime());
        schedule.setNote(request.getNote());
        scheduleRepository.save(schedule);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Schedule created")));
    }

    @PutMapping("/schedules/{scheduleId}")
    public ResponseEntity<BaseResponse<ApiMessage>> updateSchedule(@PathVariable Long scheduleId,
                                                                   @Valid @RequestBody AdminScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Schedule not found"));
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setAirTime(request.getAirTime());
        schedule.setNote(request.getNote());
        scheduleRepository.save(schedule);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Schedule updated")));
    }

    @DeleteMapping("/schedules/{scheduleId}")
    public ResponseEntity<BaseResponse<ApiMessage>> deleteSchedule(@PathVariable Long scheduleId) {
        if (!scheduleRepository.existsById(scheduleId)) {
            throw new IllegalArgumentException("Schedule not found");
        }
        scheduleRepository.deleteById(scheduleId);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Schedule deleted")));
    }

    private void applyRequestToEntity(AdminMovieRequest request, Movie movie) {
        movie.setTitle(request.getTitle().trim());
        movie.setDescription(request.getDescription());
        movie.setReleaseYear(request.getReleaseYear());
        movie.setDuration(request.getDuration());
        movie.setStatus(request.getStatus());
        movie.setTotalEpisodes(request.getTotalEpisodes());
        movie.setMovieType(request.getMovieType());
        movie.setPoster(request.getPoster());
    }

    private void applyRelations(AdminMovieRequest request, Movie movie) {
        // genres
        java.util.List<MovieGenre> currentGenres = movieGenreRepository.findByMovie(movie);
        movieGenreRepository.deleteAll(currentGenres);
        if (request.getGenreIds() != null && !request.getGenreIds().isEmpty()) {
            java.util.List<Genre> genres = genreRepository.findAllById(request.getGenreIds());
            for (Genre g : genres) {
                MovieGenre mg = new MovieGenre();
                mg.setId(new MovieGenreId(movie.getId(), g.getId()));
                mg.setMovie(movie);
                mg.setGenre(g);
                movieGenreRepository.save(mg);
            }
        }

        // actors
        java.util.List<MovieActor> currentActors = movieActorRepository.findByMovieId(movie.getId());
        movieActorRepository.deleteAll(currentActors);
        if (request.getActorIds() != null && !request.getActorIds().isEmpty()) {
            java.util.List<Actor> actors = actorRepository.findAllById(request.getActorIds());
            for (Actor a : actors) {
                MovieActor ma = new MovieActor();
                ma.setMovieId(movie.getId());
                ma.setActorId(a.getId());
                ma.setMovie(movie);
                ma.setActor(a);
                movieActorRepository.save(ma);
            }
        }

        // directors
        java.util.List<MovieDirector> currentDirectors = movieDirectorRepository.findByMovieId(movie.getId());
        movieDirectorRepository.deleteAll(currentDirectors);
        if (request.getDirectorIds() != null && !request.getDirectorIds().isEmpty()) {
            java.util.List<Director> directors = directorRepository.findAllById(request.getDirectorIds());
            for (Director d : directors) {
                MovieDirector md = new MovieDirector();
                md.setMovieId(movie.getId());
                md.setDirectorId(d.getId());
                md.setMovie(movie);
                md.setDirector(d);
                movieDirectorRepository.save(md);
            }
        }
    }
}

