package com.example.movierecommendation.movie.controller;

import com.example.movierecommendation.common.dto.ApiMessage;
import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.movie.dto.DirectorResponse;
import com.example.movierecommendation.movie.dto.CreateDirectorRequest;
import com.example.movierecommendation.movie.dto.UpdateDirectorRequest;
import com.example.movierecommendation.movie.service.DirectorService;
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
@RequestMapping("/api/admin/directors")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDirectorController {

    private final DirectorService directorService;

    public AdminDirectorController(DirectorService directorService) {
        this.directorService = directorService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<DirectorResponse>>> getAll() {
        return ResponseEntity.ok(BaseResponse.ok(directorService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<DirectorResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.ok(directorService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<DirectorResponse>> create(@Valid @RequestBody CreateDirectorRequest request) {
        return ResponseEntity.ok(BaseResponse.ok(directorService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<DirectorResponse>> update(@PathVariable Long id,
                                                                @Valid @RequestBody UpdateDirectorRequest request) {
        return ResponseEntity.ok(BaseResponse.ok(directorService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<ApiMessage>> delete(@PathVariable Long id) {
        directorService.delete(id);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Director deleted")));
    }
}
