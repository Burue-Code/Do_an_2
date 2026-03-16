package com.example.movierecommendation.movie.mapper;

import com.example.movierecommendation.movie.dto.ActorResponse;
import com.example.movierecommendation.movie.dto.UpdateActorRequest;
import com.example.movierecommendation.movie.entity.Actor;
import org.springframework.stereotype.Component;

@Component
public class ActorMapper {

    public ActorResponse toResponse(Actor actor) {
        if (actor == null) {
            return null;
        }
        ActorResponse r = new ActorResponse();
        r.setId(actor.getId());
        r.setFullName(actor.getFullName());
        r.setGender(actor.getGender());
        r.setBirthDate(actor.getBirthDate());
        r.setNationality(actor.getNationality());
        r.setBiography(actor.getBiography());
        r.setImageUrl(actor.getImageUrl());
        return r;
    }

    public void updateEntity(Actor actor, UpdateActorRequest request) {
        if (request.getFullName() != null) {
            actor.setFullName(request.getFullName());
        }
        if (request.getGender() != null) {
            actor.setGender(request.getGender());
        }
        actor.setBirthDate(request.getBirthDate());
        if (request.getNationality() != null) {
            actor.setNationality(request.getNationality());
        }
        if (request.getBiography() != null) {
            actor.setBiography(request.getBiography());
        }
        if (request.getImageUrl() != null) {
            actor.setImageUrl(request.getImageUrl());
        }
    }
}
