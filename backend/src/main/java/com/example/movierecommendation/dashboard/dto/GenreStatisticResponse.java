package com.example.movierecommendation.dashboard.dto;

public class GenreStatisticResponse {

    private Long genreId;
    private String genreName;
    private long movieCount;

    public Long getGenreId() {
        return genreId;
    }

    public void setGenreId(Long genreId) {
        this.genreId = genreId;
    }

    public String getGenreName() {
        return genreName;
    }

    public void setGenreName(String genreName) {
        this.genreName = genreName;
    }

    public long getMovieCount() {
        return movieCount;
    }

    public void setMovieCount(long movieCount) {
        this.movieCount = movieCount;
    }
}

