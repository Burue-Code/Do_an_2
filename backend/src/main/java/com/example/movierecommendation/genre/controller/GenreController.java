package com.example.movierecommendation.genre.controller;

import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.genre.dto.GenreResponse;
import com.example.movierecommendation.genre.service.GenreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final GenreService genreService;

    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<GenreResponse>>> getGenres() {
        return ResponseEntity.ok(BaseResponse.ok(genreService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<GenreResponse>> getGenre(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.ok(genreService.getById(id)));
    }
}

