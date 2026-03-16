package com.example.movierecommendation.movie.service.impl;

import com.example.movierecommendation.movie.dto.ActorResponse;
import com.example.movierecommendation.movie.dto.CreateActorRequest;
import com.example.movierecommendation.movie.dto.UpdateActorRequest;
import com.example.movierecommendation.movie.entity.Actor;
import com.example.movierecommendation.movie.mapper.ActorMapper;
import com.example.movierecommendation.movie.repository.ActorRepository;
import com.example.movierecommendation.movie.repository.MovieActorRepository;
import com.example.movierecommendation.movie.service.ActorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActorServiceImpl implements ActorService {

    private final ActorRepository actorRepository;
    private final MovieActorRepository movieActorRepository;
    private final ActorMapper actorMapper;

    public ActorServiceImpl(ActorRepository actorRepository,
                            MovieActorRepository movieActorRepository,
                            ActorMapper actorMapper) {
        this.actorRepository = actorRepository;
        this.movieActorRepository = movieActorRepository;
        this.actorMapper = actorMapper;
    }

    @Override
    public List<ActorResponse> getAll() {
        return actorRepository.findAllByOrderByFullNameAsc().stream()
                .map(actorMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ActorResponse getById(Long id) {
        Actor actor = actorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Diễn viên không tồn tại với id: " + id));
        return actorMapper.toResponse(actor);
    }

    @Override
    @Transactional
    public ActorResponse create(CreateActorRequest request) {
        Actor actor = new Actor();
        actor.setFullName(request.getFullName().trim());
        actor.setGender(request.getGender());
        actor.setBirthDate(request.getBirthDate());
        actor.setNationality(request.getNationality());
        actor.setBiography(request.getBiography());
        actor.setImageUrl(request.getImageUrl());
        Actor saved = actorRepository.save(actor);
        return actorMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ActorResponse update(Long id, UpdateActorRequest request) {
        Actor actor = actorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Diễn viên không tồn tại với id: " + id));
        actorMapper.updateEntity(actor, request);
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            actor.setFullName(request.getFullName().trim());
        }
        Actor saved = actorRepository.save(actor);
        return actorMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Actor actor = actorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Diễn viên không tồn tại với id: " + id));
        long usedCount = movieActorRepository.countByActorId(id);
        if (usedCount > 0) {
            throw new IllegalStateException(
                    "Không thể xóa diễn viên đang được sử dụng trong " + usedCount + " phim. Vui lòng gỡ khỏi phim trước.");
        }
        actorRepository.delete(actor);
    }
}
