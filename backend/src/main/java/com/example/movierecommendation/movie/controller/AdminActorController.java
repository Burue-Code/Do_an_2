package com.example.movierecommendation.movie.controller;

import com.example.movierecommendation.common.dto.ApiMessage;
import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.movie.dto.ActorResponse;
import com.example.movierecommendation.movie.dto.CreateActorRequest;
import com.example.movierecommendation.movie.dto.UpdateActorRequest;
import com.example.movierecommendation.movie.service.ActorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/actors")
@PreAuthorize("hasRole('ADMIN')")
public class AdminActorController {

    private final ActorService actorService;

    public AdminActorController(ActorService actorService) {
        this.actorService = actorService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<ActorResponse>>> getAll() {
        return ResponseEntity.ok(BaseResponse.ok(actorService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<ActorResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.ok(actorService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<ActorResponse>> create(@Valid @RequestBody CreateActorRequest request) {
        return ResponseEntity.ok(BaseResponse.ok(actorService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<ActorResponse>> update(@PathVariable Long id,
                                                              @Valid @RequestBody UpdateActorRequest request) {
        return ResponseEntity.ok(BaseResponse.ok(actorService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<ApiMessage>> delete(@PathVariable Long id) {
        actorService.delete(id);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Actor deleted")));
    }
}
