package com.example.movierecommendation.auth.service.impl;

import com.example.movierecommendation.auth.dto.AuthResponse;
import com.example.movierecommendation.auth.dto.ChangePasswordRequest;
import com.example.movierecommendation.auth.dto.LoginRequest;
import com.example.movierecommendation.auth.dto.RegisterRequest;
import com.example.movierecommendation.auth.dto.UpdateProfileRequest;
import com.example.movierecommendation.auth.service.AuthService;
import com.example.movierecommendation.role.entity.Role;
import com.example.movierecommendation.role.repository.RoleRepository;
import com.example.movierecommendation.security.JwtTokenProvider;
import com.example.movierecommendation.security.SecurityUtils;
import com.example.movierecommendation.genre.entity.Genre;
import com.example.movierecommendation.genre.repository.GenreRepository;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.entity.UserGenre;
import com.example.movierecommendation.user.entity.UserGenreId;
import com.example.movierecommendation.user.mapper.UserMapper;
import com.example.movierecommendation.user.repository.UserGenreRepository;
import com.example.movierecommendation.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserGenreRepository userGenreRepository;
    private final GenreRepository genreRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           UserGenreRepository userGenreRepository,
                           GenreRepository genreRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider,
                           UserMapper userMapper) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.userGenreRepository = userGenreRepository;
        this.genreRepository = genreRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new IllegalStateException("ROLE_USER not configured"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);

        userRepository.save(user);

        // Tự động đăng nhập sau đăng ký mà không đi qua AuthenticationManager để tránh lỗi 401
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                true,
                true,
                true,
                !user.isLocked(),
                java.util.Collections.singletonList(new SimpleGrantedAuthority(userRole.getName()))
        );

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        String token = jwtTokenProvider.generateToken(authentication);
        if (token == null) {
            throw new IllegalStateException("Cannot generate token");
        }

        AuthResponse response = new AuthResponse();
        response.setAccessToken(token);
        response.setUser(userMapper.toUserProfileResponse(user));
        return response;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);
        if (token == null) {
            throw new IllegalStateException("Cannot generate token");
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        AuthResponse response = new AuthResponse();
        response.setAccessToken(token);
        response.setUser(userMapper.toUserProfileResponse(user));
        return response;
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public com.example.movierecommendation.user.dto.UserProfileResponse getCurrentUserProfile() {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        com.example.movierecommendation.user.dto.UserProfileResponse response = userMapper.toUserProfileResponse(user);
        List<Long> genreIds = userGenreRepository.findByUser_Id(user.getId()).stream()
                .map(ug -> ug.getGenre().getId())
                .collect(Collectors.toList());
        response.setFavoriteGenreIds(genreIds);
        return response;
    }

    @Override
    @Transactional
    public com.example.movierecommendation.user.dto.UserProfileResponse updateProfile(UpdateProfileRequest request) {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        user.setFullName(request.getFullName().trim());

        String phone = request.getPhoneNumber();
        String trimmedPhone = phone != null ? phone.trim() : null;
        user.setPhoneNumber(trimmedPhone == null || trimmedPhone.isEmpty() ? null : trimmedPhone);

        String email = request.getEmail();
        String trimmedEmail = email != null ? email.trim() : null;
        user.setEmail(trimmedEmail == null || trimmedEmail.isEmpty() ? null : trimmedEmail);
        userRepository.save(user);
        return getCurrentUserProfile();
    }

    @Override
    @Transactional
    public void setFavoriteGenres(List<Long> genreIds) {
        String username = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        userGenreRepository.deleteByUser_Id(user.getId());
        if (genreIds != null && !genreIds.isEmpty()) {
            List<Genre> genres = genreRepository.findAllById(genreIds);
            for (Genre g : genres) {
                UserGenre ug = new UserGenre();
                ug.setId(new UserGenreId(user.getId(), g.getId()));
                ug.setUser(user);
                ug.setGenre(g);
                userGenreRepository.save(ug);
            }
        }
    }
}

