package com.example.movierecommendation.genre.service;

import com.example.movierecommendation.genre.dto.CreateGenreRequest;
import com.example.movierecommendation.genre.dto.GenreResponse;
import com.example.movierecommendation.genre.dto.UpdateGenreRequest;

import java.util.List;

public interface GenreService {

    List<GenreResponse> getAll();

    GenreResponse getById(Long id);

    GenreResponse create(CreateGenreRequest request);

    GenreResponse update(Long id, UpdateGenreRequest request);

    void delete(Long id);
}

