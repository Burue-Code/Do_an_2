package com.example.movierecommendation.movie.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.movie.dto.MovieListResponse;
import com.example.movierecommendation.movie.dto.PublicScheduleItemResponse;
import com.example.movierecommendation.movie.entity.Schedule;
import com.example.movierecommendation.movie.mapper.MovieMapper;
import com.example.movierecommendation.movie.repository.ScheduleRepository;
import com.example.movierecommendation.security.SecurityUtils;
import com.example.movierecommendation.user.repository.UserRepository;
import com.example.movierecommendation.watchhistory.repository.WatchLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleRepository scheduleRepository;
    private final MovieMapper movieMapper;
    private final UserRepository userRepository;
    private final WatchLogRepository watchLogRepository;

    public ScheduleController(ScheduleRepository scheduleRepository,
                              MovieMapper movieMapper,
                              UserRepository userRepository,
                              WatchLogRepository watchLogRepository) {
        this.scheduleRepository = scheduleRepository;
        this.movieMapper = movieMapper;
        this.userRepository = userRepository;
        this.watchLogRepository = watchLogRepository;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<PublicScheduleItemResponse>>> getSchedules(
            @RequestParam(required = false) String dayOfWeek
    ) {
        Set<Long> completedMovieIds = SecurityUtils.getCurrentUsername()
                .flatMap(userRepository::findByUsername)
                .map(u -> watchLogRepository.findByUser_IdAndCompletedTrue(u.getId()).stream()
                        .map(w -> w.getMovie() != null ? w.getMovie().getId() : null)
                        .filter(id -> id != null)
                        .collect(Collectors.toSet()))
                .orElse(Set.of());

        List<Schedule> schedules = scheduleRepository.findAllByOrderByDayOfWeekAscAirTimeAscIdAsc();
        List<PublicScheduleItemResponse> items = schedules.stream()
                .filter(s -> dayOfWeek == null || dayOfWeek.trim().isEmpty() || String.valueOf(s.getDayOfWeek()).trim().equals(dayOfWeek.trim()))
                .filter(s -> s.getMovie() == null || s.getMovie().getId() == null || !completedMovieIds.contains(s.getMovie().getId()))
                .sorted(Comparator
                        .comparing((Schedule s) -> safeDaySortKey(s.getDayOfWeek()))
                        .thenComparing(s -> s.getAirTime() == null ? "" : s.getAirTime())
                        .thenComparing(s -> s.getId() == null ? 0L : s.getId())
                )
                .map(s -> {
                    PublicScheduleItemResponse dto = new PublicScheduleItemResponse();
                    MovieListResponse movie = movieMapper.toListDto(s.getMovie());
                    dto.setMovie(movie);
                    dto.setDayOfWeek(s.getDayOfWeek());
                    dto.setAirTime(s.getAirTime());
                    dto.setNote(s.getNote());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(BaseResponse.ok(items));
    }

    private int safeDaySortKey(String dayOfWeek) {
        if (dayOfWeek == null) return 999;
        String d = dayOfWeek.trim();
        try {
            return Integer.parseInt(d);
        } catch (NumberFormatException ex) {
            // nếu lưu dạng chữ thì để cuối
            return 998;
        }
    }
}

