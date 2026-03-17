package com.example.movierecommendation.movie.dto;

public class PublicScheduleItemResponse {

    private MovieListResponse movie;
    private String dayOfWeek;
    private String airTime;
    private String note;

    public MovieListResponse getMovie() {
        return movie;
    }

    public void setMovie(MovieListResponse movie) {
        this.movie = movie;
    }

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

