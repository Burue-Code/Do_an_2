package com.example.movierecommendation.movie.service;

import com.example.movierecommendation.movie.dto.DirectorResponse;
import com.example.movierecommendation.movie.dto.CreateDirectorRequest;
import com.example.movierecommendation.movie.dto.UpdateDirectorRequest;

import java.util.List;

public interface DirectorService {

    List<DirectorResponse> getAll();

    DirectorResponse getById(Long id);

    DirectorResponse create(CreateDirectorRequest request);

    DirectorResponse update(Long id, UpdateDirectorRequest request);

    void delete(Long id);
}
