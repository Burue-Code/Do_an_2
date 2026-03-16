package com.example.movierecommendation.movie.mapper;

import com.example.movierecommendation.movie.dto.DirectorResponse;
import com.example.movierecommendation.movie.dto.UpdateDirectorRequest;
import com.example.movierecommendation.movie.entity.Director;
import org.springframework.stereotype.Component;

@Component
public class DirectorMapper {

    public DirectorResponse toResponse(Director director) {
        if (director == null) {
            return null;
        }
        DirectorResponse r = new DirectorResponse();
        r.setId(director.getId());
        r.setFullName(director.getFullName());
        r.setBirthDate(director.getBirthDate());
        r.setAwards(director.getAwards());
        r.setBiography(director.getBiography());
        return r;
    }

    public void updateEntity(Director director, UpdateDirectorRequest request) {
        if (request.getFullName() != null) {
            director.setFullName(request.getFullName());
        }
        director.setBirthDate(request.getBirthDate());
        if (request.getAwards() != null) {
            director.setAwards(request.getAwards());
        }
        if (request.getBiography() != null) {
            director.setBiography(request.getBiography());
        }
    }
}
