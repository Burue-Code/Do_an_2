package com.example.movierecommendation.movie.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.movie.entity.Actor;
import com.example.movierecommendation.movie.entity.Director;
import com.example.movierecommendation.movie.repository.ActorRepository;
import com.example.movierecommendation.movie.repository.DirectorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/cast")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCastController {

    private final ActorRepository actorRepository;
    private final DirectorRepository directorRepository;

    public AdminCastController(ActorRepository actorRepository, DirectorRepository directorRepository) {
        this.actorRepository = actorRepository;
        this.directorRepository = directorRepository;
    }

    @GetMapping("/actors")
    public ResponseEntity<BaseResponse<List<SimplePersonResponse>>> searchActors(
            @RequestParam String keyword) {
        List<Actor> list = actorRepository
                .findTop10ByFullNameContainingIgnoreCaseOrderByFullNameAsc(keyword.trim());
        List<SimplePersonResponse> result = list.stream()
                .map(a -> new SimplePersonResponse(a.getId(), a.getFullName()))
                .toList();
        return ResponseEntity.ok(BaseResponse.ok(result));
    }

    @GetMapping("/directors")
    public ResponseEntity<BaseResponse<List<SimplePersonResponse>>> searchDirectors(
            @RequestParam String keyword) {
        List<Director> list = directorRepository
                .findTop10ByFullNameContainingIgnoreCaseOrderByFullNameAsc(keyword.trim());
        List<SimplePersonResponse> result = list.stream()
                .map(d -> new SimplePersonResponse(d.getId(), d.getFullName()))
                .toList();
        return ResponseEntity.ok(BaseResponse.ok(result));
    }

    public static class SimplePersonResponse {
        private Long id;
        private String fullName;

        public SimplePersonResponse(Long id, String fullName) {
            this.id = id;
            this.fullName = fullName;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }
    }
}

