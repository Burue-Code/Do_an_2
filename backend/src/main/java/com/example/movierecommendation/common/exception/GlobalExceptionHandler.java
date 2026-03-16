package com.example.movierecommendation.common.exception;

import com.example.movierecommendation.common.dto.BaseResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String ACCOUNT_LOCKED_MESSAGE = "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.";

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<BaseResponse<Void>> handleLockedException(LockedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(BaseResponse.error(ACCOUNT_LOCKED_MESSAGE));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<BaseResponse<Void>> handleBadCredentialsException(BadCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(BaseResponse.error("Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại."));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<BaseResponse<Void>> handleIllegalArgumentException(IllegalArgumentException ex) {
        String message = ex.getMessage();
        if ("ACCOUNT_LOCKED".equals(message)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(BaseResponse.error(ACCOUNT_LOCKED_MESSAGE));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BaseResponse.error(message != null ? message : "Dữ liệu không hợp lệ."));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<BaseResponse<Void>> handleIllegalStateException(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BaseResponse.error(ex.getMessage() != null ? ex.getMessage() : "Trạng thái không hợp lệ."));
    }
}
