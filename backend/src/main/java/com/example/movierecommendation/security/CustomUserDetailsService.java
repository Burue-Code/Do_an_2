package com.example.movierecommendation.security;

import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

/**
 * Load UserDetails từ database theo tech stack.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        String roleName = user.getRole() != null ? user.getRole().getName() : "ROLE_USER";
        boolean accountNonLocked = !user.isLocked();
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                true, // enabled
                true, // accountNonExpired
                true, // credentialsNonExpired
                accountNonLocked,
                Collections.singletonList(new SimpleGrantedAuthority(roleName))
        );
    }
}
