package com.example.movierecommendation.user.service.impl;

import com.example.movierecommendation.user.entity.User;
import com.example.movierecommendation.user.repository.UserRepository;
import com.example.movierecommendation.user.service.UserService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
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

