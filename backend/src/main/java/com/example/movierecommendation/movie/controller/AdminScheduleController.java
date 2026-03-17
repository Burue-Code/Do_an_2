package com.example.movierecommendation.movie.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.movie.dto.AdminScheduleRequest;
import com.example.movierecommendation.movie.dto.AdminScheduleResponse;
import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.entity.Schedule;
import com.example.movierecommendation.movie.repository.MovieRepository;
import com.example.movierecommendation.movie.repository.ScheduleRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/schedules")
@PreAuthorize("hasRole('ADMIN')")
public class AdminScheduleController {

    private final ScheduleRepository scheduleRepository;
    private final MovieRepository movieRepository;

    public AdminScheduleController(ScheduleRepository scheduleRepository,
                                   MovieRepository movieRepository) {
        this.scheduleRepository = scheduleRepository;
        this.movieRepository = movieRepository;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<AdminScheduleResponse>>> getAll() {
        List<Schedule> schedules = scheduleRepository.findAllByOrderByDayOfWeekAscAirTimeAscIdAsc();
        List<AdminScheduleResponse> items = schedules.stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(BaseResponse.ok(items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<AdminScheduleResponse>> getById(@PathVariable Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Schedule not found"));
        return ResponseEntity.ok(BaseResponse.ok(toResponse(schedule)));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<AdminScheduleResponse>> create(@Valid @RequestBody AdminScheduleRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        Schedule s = new Schedule();
        s.setMovie(movie);
        s.setDayOfWeek(request.getDayOfWeek());
        s.setAirTime(request.getAirTime());
        s.setNote(request.getNote());
        Schedule saved = scheduleRepository.save(s);
        return ResponseEntity.ok(BaseResponse.ok(toResponse(saved)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<AdminScheduleResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody AdminScheduleRequest request
    ) {
        Schedule s = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Schedule not found"));
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        s.setMovie(movie);
        s.setDayOfWeek(request.getDayOfWeek());
        s.setAirTime(request.getAirTime());
        s.setNote(request.getNote());
        Schedule saved = scheduleRepository.save(s);
        return ResponseEntity.ok(BaseResponse.ok(toResponse(saved)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> delete(@PathVariable Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new IllegalArgumentException("Schedule not found");
        }
        scheduleRepository.deleteById(id);
        return ResponseEntity.ok(BaseResponse.ok(null));
    }

    private AdminScheduleResponse toResponse(Schedule s) {
        AdminScheduleResponse dto = new AdminScheduleResponse();
        dto.setId(s.getId());
        if (s.getMovie() != null) {
            dto.setMovieId(s.getMovie().getId());
            dto.setMovieTitle(s.getMovie().getTitle());
        }
        dto.setDayOfWeek(s.getDayOfWeek());
        dto.setAirTime(s.getAirTime());
        dto.setNote(s.getNote());
        return dto;
    }
}

