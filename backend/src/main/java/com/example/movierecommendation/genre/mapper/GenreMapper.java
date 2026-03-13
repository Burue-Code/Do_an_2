package com.example.movierecommendation.genre.mapper;

import com.example.movierecommendation.genre.dto.GenreResponse;
import com.example.movierecommendation.genre.entity.Genre;
import org.springframework.stereotype.Component;

@Component
public class GenreMapper {

    public GenreResponse toDto(Genre genre) {
        if (genre == null) {
            return null;
        }
        GenreResponse dto = new GenreResponse();
        dto.setId(genre.getId());
        dto.setName(genre.getName());
        return dto;
    }
}

