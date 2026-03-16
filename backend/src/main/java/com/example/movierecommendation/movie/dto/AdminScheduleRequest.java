package com.example.movierecommendation.movie.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminScheduleRequest {

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
}

