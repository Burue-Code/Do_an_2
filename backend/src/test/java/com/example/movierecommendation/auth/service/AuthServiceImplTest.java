package com.example.movierecommendation.auth.service;

import com.example.movierecommendation.auth.dto.AuthResponse;
import com.example.movierecommendation.auth.dto.LoginRequest;
import com.example.movierecommendation.auth.dto.RegisterRequest;
import com.example.movierecommendation.auth.service.impl.AuthServiceImpl;
import com.example.movierecommendation.role.entity.Role;
import com.example.movierecommendation.role.repository.RoleRepository;
import com.example.movierecommendation.user.dto.UserProfileResponse;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.mapper.UserMapper;
import com.example.movierecommendation.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.movierecommendation.security.JwtTokenProvider;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;


    @Mock
    private Authentication authentication;

    private UserMapper userMapper;
    private AuthServiceImpl authService;

    private Role userRole;

    @BeforeEach
    void setUp() {
        userRole = new Role();
        userRole.setId(1L);
        userRole.setName("ROLE_USER");

        userMapper = new UserMapper();

        authService = new AuthServiceImpl(
                authenticationManager,
                userRepository,
                roleRepository,
                passwordEncoder,
                new JwtTokenProvider(),
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

        given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .willReturn(authentication);
        given(authentication.getName()).willReturn("john");
        given(userRepository.findByUsername("john")).willReturn(Optional.of(savedUser));

        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(10L);
        profile.setUsername("john");
        profile.setFullName("John Doe");
        profile.setRole("ROLE_USER");
        given(userMapper.toUserProfileResponse(savedUser)).willReturn(profile);

        AuthResponse response = authService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isNotBlank();
        assertThat(response.getUser().getUsername()).isEqualTo("john");

        verify(userRepository).existsByUsername("john");
        verify(roleRepository).findByName("ROLE_USER");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByUsername("john");
        verify(userMapper).toUserProfileResponse(savedUser);
        verifyNoMoreInteractions(userRepository, roleRepository, passwordEncoder, userMapper);
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
        verifyNoMoreInteractions(userRepository, roleRepository, passwordEncoder);
    }

    @Test
    void login_shouldAuthenticateAndReturnAuthResponse() {
        LoginRequest request = new LoginRequest();
        request.setUsername("john");
        request.setPassword("password123");

        given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .willReturn(authentication);
        given(authentication.getName()).willReturn("john");

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
        verify(userRepository).findByUsername("john");
        verifyNoMoreInteractions(userRepository, roleRepository, passwordEncoder);
    }
}

