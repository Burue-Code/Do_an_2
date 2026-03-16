package com.example.movierecommendation.auth.service.impl;

import com.example.movierecommendation.auth.service.LoginFailureRecorder;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginFailureRecorderImpl implements LoginFailureRecorder {

    private static final Logger log = LoggerFactory.getLogger(LoginFailureRecorderImpl.class);
    private static final int MAX_FAILED_ATTEMPTS = 5;

    private final UserRepository userRepository;

    public LoginFailureRecorderImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordFailedAttempt(String username) {
        log.info("recordFailedAttempt: username={}", username);
        User u = userRepository.findByUsername(username).orElse(null);
        if (u == null) {
            log.warn("recordFailedAttempt: user not found for username={}", username);
            return;
        }
        int attempts = u.getFailedLoginAttempts() + 1;
        u.setFailedLoginAttempts(attempts);
        if (attempts >= MAX_FAILED_ATTEMPTS) {
            u.setLocked(true);
            log.warn("Tài khoản {} bị khóa do đăng nhập sai {} lần.", username, attempts);
        } else {
            log.info("Đăng nhập sai cho user {}: lần thứ {}", username, attempts);
        }
        userRepository.save(u);
        log.info("recordFailedAttempt: đã lưu failed_login_attempts={} cho user {}", attempts, username);
    }
}
