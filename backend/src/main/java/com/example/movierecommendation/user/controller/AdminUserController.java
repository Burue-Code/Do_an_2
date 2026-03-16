package com.example.movierecommendation.user.controller;

import com.example.movierecommendation.common.dto.ApiMessage;
import com.example.movierecommendation.common.dto.BaseResponse;
import com.example.movierecommendation.user.dto.AdminUserResponse;
import com.example.movierecommendation.user.dto.ChangeRoleRequest;
import com.example.movierecommendation.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<AdminUserResponse>>> getAllUsers() {
        return ResponseEntity.ok(BaseResponse.ok(userService.getAllForAdmin()));
    }

    @PatchMapping("/{id}/lock")
    public ResponseEntity<BaseResponse<ApiMessage>> lockUser(@PathVariable Long id) {
        userService.lockUser(id);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("User locked")));
    }

    @PatchMapping("/{id}/unlock")
    public ResponseEntity<BaseResponse<ApiMessage>> unlockUser(@PathVariable Long id) {
        userService.unlockUser(id);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("User unlocked")));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<BaseResponse<ApiMessage>> changeRole(@PathVariable Long id,
                                                              @Valid @RequestBody ChangeRoleRequest request) {
        userService.changeRole(id, request.getRole());
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("Role updated")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<ApiMessage>> deleteUser(@PathVariable Long id) {
        userService.deleteUserByAdmin(id);
        return ResponseEntity.ok(BaseResponse.ok(ApiMessage.ok("User deleted")));
    }
}

