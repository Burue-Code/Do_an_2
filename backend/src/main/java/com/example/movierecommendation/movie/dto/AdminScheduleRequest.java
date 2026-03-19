package com.example.movierecommendation.movie.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminScheduleRequest {

    // movieId dùng cho AdminScheduleController (API /api/admin/schedules),
    // nên vẫn giữ nhưng không bắt buộc NotNull để tái sử dụng DTO cho AdminMovieController.
    private Long movieId;

    @NotBlank
    private String dayOfWeek;

    @NotBlank
    private String airTime;

    private String note;

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getAirTime() {
        return airTime;
    }

    public void setAirTime(String airTime) {
        this.airTime = airTime;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }
}
