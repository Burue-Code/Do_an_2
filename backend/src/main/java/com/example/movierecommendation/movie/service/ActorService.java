package com.example.movierecommendation.movie.service;

import com.example.movierecommendation.movie.dto.ActorResponse;
import com.example.movierecommendation.movie.dto.CreateActorRequest;
import com.example.movierecommendation.movie.dto.UpdateActorRequest;

import java.util.List;

public interface ActorService {

    List<ActorResponse> getAll();

    ActorResponse getById(Long id);

    ActorResponse create(CreateActorRequest request);

    ActorResponse update(Long id, UpdateActorRequest request);

    void delete(Long id);
}
