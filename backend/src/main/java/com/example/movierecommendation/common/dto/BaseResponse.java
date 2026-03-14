package com.example.movierecommendation.common.dto;

/**
 * Response wrapper chuẩn cho API theo tech stack.
 * Luôn dùng DTO, không expose entity JPA trực tiếp.
 */
public class BaseResponse<T> {

    private boolean success;
    private T data;
    private String message;

    public BaseResponse() {
    }

    public BaseResponse(boolean success, T data) {
        this.success = success;
        this.data = data;
        this.message = null;
    }

    public BaseResponse(boolean success, T data, String message) {
        this.success = success;
        this.data = data;
        this.message = message;
    }

    public static <T> BaseResponse<T> ok(T data) {
        return new BaseResponse<>(true, data);
    }

    public static <T> BaseResponse<T> ok(T data, String message) {
        return new BaseResponse<>(true, data, message);
    }

    public static <T> BaseResponse<T> error(String message) {
        return new BaseResponse<>(false, null, message);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
