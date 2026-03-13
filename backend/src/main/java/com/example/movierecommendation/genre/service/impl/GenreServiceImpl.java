package com.example.movierecommendation.genre.service.impl;

import com.example.movierecommendation.genre.dto.CreateGenreRequest;
import com.example.movierecommendation.genre.dto.GenreResponse;
import com.example.movierecommendation.genre.dto.UpdateGenreRequest;
import com.example.movierecommendation.genre.entity.Genre;
import com.example.movierecommendation.genre.mapper.GenreMapper;
import com.example.movierecommendation.genre.repository.GenreRepository;
import com.example.movierecommendation.genre.service.GenreService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final GenreMapper genreMapper;

    public GenreServiceImpl(GenreRepository genreRepository, GenreMapper genreMapper) {
        this.genreRepository = genreRepository;
        this.genreMapper = genreMapper;
    }

    @Override
    public List<GenreResponse> getAll() {
        return genreRepository.findAll().stream()
                .map(genreMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public GenreResponse getById(Long id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Genre not found"));
        return genreMapper.toDto(genre);
    }

    @Override
    @Transactional
    public GenreResponse create(CreateGenreRequest request) {
        Genre genre = new Genre();
        genre.setName(request.getName());
        Genre saved = genreRepository.save(genre);
        return genreMapper.toDto(saved);
    }

    @Override
    @Transactional
    public GenreResponse update(Long id, UpdateGenreRequest request) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Genre not found"));
        genre.setName(request.getName());
        Genre saved = genreRepository.save(genre);
        return genreMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        genreRepository.deleteById(id);
    }
}

