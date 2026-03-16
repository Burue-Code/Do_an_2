package com.example.movierecommendation.user.service.impl;

import com.example.movierecommendation.role.entity.Role;
import com.example.movierecommendation.role.repository.RoleRepository;
import com.example.movierecommendation.user.dto.AdminUserResponse;
import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.mapper.UserMapper;
import com.example.movierecommendation.user.repository.UserRepository;
import com.example.movierecommendation.user.service.UserService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
    }

    @Override
    public List<AdminUserResponse> getAllForAdmin() {
        return userMapper.toAdminUserResponseList(userRepository.findAllWithRole());
    }

    @Override
    @Transactional
    public void lockUser(Long userId) {
        User user = getUserOrThrow(userId);
        user.setLocked(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void unlockUser(Long userId) {
        User user = getUserOrThrow(userId);
        user.setLocked(false);
        user.setFailedLoginAttempts(0);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void changeRole(Long userId, String roleName) {
        User user = getUserOrThrow(userId);
        String currentUsername = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : null;
        if (currentUsername != null && currentUsername.equals(user.getUsername())) {
            throw new IllegalStateException("Không thể thay đổi quyền của chính mình.");
        }
        Role role = roleRepository.findByName(roleName.trim())
                .orElseThrow(() -> new IllegalArgumentException("Role không tồn tại: " + roleName));
        user.setRole(role);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUserByAdmin(Long userId) {
        User user = getUserOrThrow(userId);
        try {
            userRepository.delete(user);
        } catch (DataIntegrityViolationException ex) {
            // Ở đây có thể ném ra custom exception để handler chung convert thành BaseResponse error.
            throw ex;
        }
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
    }
}

