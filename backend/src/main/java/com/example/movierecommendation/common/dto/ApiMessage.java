package com.example.movierecommendation.common.dto;

/**
 * Response đơn giản cho thông báo API (success/error message) theo tech stack.
 */
public class ApiMessage {

    private boolean success;
    private String message;

    public ApiMessage() {
    }

    public ApiMessage(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static ApiMessage ok(String message) {
        return new ApiMessage(true, message);
    }

    public static ApiMessage error(String message) {
        return new ApiMessage(false, message);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
