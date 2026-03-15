package com.example.movierecommendation.auth.service;

import com.example.movierecommendation.auth.dto.AuthResponse;
import com.example.movierecommendation.auth.dto.LoginRequest;
import com.example.movierecommendation.auth.dto.RegisterRequest;
import com.example.movierecommendation.auth.service.impl.AuthServiceImpl;
import com.example.movierecommendation.genre.repository.GenreRepository;
import com.example.movierecommendation.role.entity.Role;
import com.example.movierecommendation.role.repository.RoleRepository;
import com.example.movierecommendation.security.JwtTokenProvider;
import com.example.movierecommendation.user.dto.UserProfileResponse;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.mapper.UserMapper;
import com.example.movierecommendation.user.repository.UserGenreRepository;
import com.example.movierecommendation.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserGenreRepository userGenreRepository;

    @Mock
    private GenreRepository genreRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private Authentication authentication;

    @Mock
    private UserMapper userMapper;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    private AuthServiceImpl authService;

    private Role userRole;

    @BeforeEach
    void setUp() {
        userRole = new Role();
        userRole.setId(1L);
        userRole.setName("ROLE_USER");

        authService = new AuthServiceImpl(
                authenticationManager,
                userRepository,
                userGenreRepository,
                genreRepository,
                roleRepository,
                passwordEncoder,
                jwtTokenProvider,
                userMapper
        );
    }


    @Test
    void register_shouldCreateUserAndReturnAuthResponse() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("john");
        request.setFullName("John Doe");
        request.setPassword("password123");

        given(userRepository.existsByUsername("john")).willReturn(false);
        given(roleRepository.findByName("ROLE_USER")).willReturn(Optional.of(userRole));
        given(passwordEncoder.encode("password123")).willReturn("hashed");

        User savedUser = new User();
        savedUser.setId(10L);
        savedUser.setUsername("john");
        savedUser.setFullName("John Doe");
        savedUser.setRole(userRole);
        savedUser.setPasswordHash("hashed");

        given(userRepository.save(any(User.class))).willReturn(savedUser);

        given(jwtTokenProvider.generateToken(any(Authentication.class))).willReturn("test-access-token");

        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(10L);
        profile.setUsername("john");
        profile.setFullName("John Doe");
        profile.setRole("ROLE_USER");
        given(userMapper.toUserProfileResponse(any(User.class))).willReturn(profile);

        AuthResponse response = authService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isNotBlank();
        assertThat(response.getUser().getUsername()).isEqualTo("john");

        verify(userRepository).existsByUsername("john");
        verify(roleRepository).findByName("ROLE_USER");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(jwtTokenProvider).generateToken(any(Authentication.class));
        verify(userMapper).toUserProfileResponse(any(User.class));
        verifyNoMoreInteractions(
                userRepository,
                userGenreRepository,
                genreRepository,
                roleRepository,
                passwordEncoder,
                userMapper,
                jwtTokenProvider
        );
    }

    @Test
    void register_shouldThrowWhenUsernameExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("john");
        request.setFullName("John Doe");
        request.setPassword("password123");

        given(userRepository.existsByUsername("john")).willReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Username already exists");

        verify(userRepository).existsByUsername("john");
        verifyNoMoreInteractions(
                userRepository,
                userGenreRepository,
                genreRepository,
                roleRepository,
                passwordEncoder,
                userMapper,
                jwtTokenProvider,
                authenticationManager,
                authentication
        );
    }

    @Test
    void login_shouldAuthenticateAndReturnAuthResponse() {
        LoginRequest request = new LoginRequest();
        request.setUsername("john");
        request.setPassword("password123");

        given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .willReturn(authentication);
        given(authentication.getName()).willReturn("john");
        given(jwtTokenProvider.generateToken(any(Authentication.class))).willReturn("test-access-token");

        User user = new User();
        user.setId(10L);
        user.setUsername("john");
        user.setFullName("John Doe");
        user.setRole(userRole);
        given(userRepository.findByUsername(eq("john"))).willReturn(Optional.of(user));

        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(10L);
        profile.setUsername("john");
        profile.setFullName("John Doe");
        profile.setRole("ROLE_USER");
        given(userMapper.toUserProfileResponse(user)).willReturn(profile);

        AuthResponse response = authService.login(request);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isNotBlank();
        assertThat(response.getUser().getFullName()).isEqualTo("John Doe");

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenProvider).generateToken(any(Authentication.class));
        verify(userRepository).findByUsername("john");
        verify(userMapper).toUserProfileResponse(user);
        verifyNoMoreInteractions(
                userRepository,
                userGenreRepository,
                genreRepository,
                roleRepository,
                passwordEncoder,
                userMapper,
                jwtTokenProvider,
                authenticationManager,
                authentication
        );
    }
}