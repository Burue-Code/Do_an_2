package com.example.movierecommendation.movie.service.impl;

import com.example.movierecommendation.movie.dto.DirectorResponse;
import com.example.movierecommendation.movie.dto.CreateDirectorRequest;
import com.example.movierecommendation.movie.dto.UpdateDirectorRequest;
import com.example.movierecommendation.movie.entity.Director;
import com.example.movierecommendation.movie.mapper.DirectorMapper;
import com.example.movierecommendation.movie.repository.DirectorRepository;
import com.example.movierecommendation.movie.repository.MovieDirectorRepository;
import com.example.movierecommendation.movie.service.DirectorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DirectorServiceImpl implements DirectorService {

    private final DirectorRepository directorRepository;
    private final MovieDirectorRepository movieDirectorRepository;
    private final DirectorMapper directorMapper;

    public DirectorServiceImpl(DirectorRepository directorRepository,
                               MovieDirectorRepository movieDirectorRepository,
                               DirectorMapper directorMapper) {
        this.directorRepository = directorRepository;
        this.movieDirectorRepository = movieDirectorRepository;
        this.directorMapper = directorMapper;
    }

    @Override
    public List<DirectorResponse> getAll() {
        return directorRepository.findAllByOrderByFullNameAsc().stream()
                .map(directorMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DirectorResponse getById(Long id) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Đạo diễn không tồn tại với id: " + id));
        return directorMapper.toResponse(director);
    }

    @Override
    @Transactional
    public DirectorResponse create(CreateDirectorRequest request) {
        Director director = new Director();
        director.setFullName(request.getFullName().trim());
        director.setBirthDate(request.getBirthDate());
        director.setAwards(request.getAwards());
        director.setBiography(request.getBiography());
        Director saved = directorRepository.save(director);
        return directorMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public DirectorResponse update(Long id, UpdateDirectorRequest request) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Đạo diễn không tồn tại với id: " + id));
        directorMapper.updateEntity(director, request);
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            director.setFullName(request.getFullName().trim());
        }
        Director saved = directorRepository.save(director);
        return directorMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Đạo diễn không tồn tại với id: " + id));
        long usedCount = movieDirectorRepository.countByDirectorId(id);
        if (usedCount > 0) {
            throw new IllegalStateException(
                    "Không thể xóa đạo diễn đang được sử dụng trong " + usedCount + " phim. Vui lòng gỡ khỏi phim trước.");
        }
        directorRepository.delete(director);
    }
}
