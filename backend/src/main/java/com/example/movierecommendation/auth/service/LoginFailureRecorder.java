package com.example.movierecommendation.auth.service;

/**
 * Ghi nhận lần đăng nhập sai trong transaction riêng (REQUIRES_NEW)
 * để commit trước khi login() ném exception (tránh rollback mất cập nhật).
 */
public interface LoginFailureRecorder {

    void recordFailedAttempt(String username);
}
