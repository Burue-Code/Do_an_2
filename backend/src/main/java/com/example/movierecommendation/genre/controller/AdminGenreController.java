package com.example.movierecommendation.genre.controller;

import com.example.movierecommendation.common.dto.ApiMessage;
import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.genre.dto.CreateGenreRequest;
import com.example.movierecommendation.genre.dto.GenreResponse;
import com.example.movierecommendation.genre.dto.UpdateGenreRequest;
import com.example.movierecommendation.genre.service.GenreService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/genres")
@PreAuthorize("hasRole('ADMIN')")
public class AdminGenreController {

    private final GenreService genreService;

    public AdminGenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @PostMapping
    public ResponseEntity<BaseResponse<GenreResponse>> createGenre(@Valid @RequestBody CreateGenreRequest request) {
        return ResponseEntity.ok(BaseResponse.ok(genreService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<GenreResponse>> updateGenre(@PathVariable Long id,
                                                                   @Valid @RequestBody UpdateGenreRequest request) {
        return ResponseEntity.ok(BaseResponse.ok(genreService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<ApiMessage>> deleteGenre(@PathVariable Long id) {
        genreService.delete(id);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Genre deleted")));
    }
}

