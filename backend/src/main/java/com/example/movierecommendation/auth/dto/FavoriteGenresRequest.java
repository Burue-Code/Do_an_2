package com.example.movierecommendation.auth.dto;

import java.util.ArrayList;
import java.util.List;

public class FavoriteGenresRequest {

    /** Null hoặc rỗng = xóa hết thể loại yêu thích */
    private List<Long> genreIds;

    public List<Long> getGenreIds() {
        return genreIds != null ? genreIds : new ArrayList<>();
    }

    public void setGenreIds(List<Long> genreIds) {
        this.genreIds = genreIds;
    }
}
