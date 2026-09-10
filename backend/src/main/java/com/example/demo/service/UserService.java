package com.example.demo.service;

import com.example.demo.dto.UserDto;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<UserDto> findByName(String name) {
        return userRepository.findByUser(name).map(this::toDto);
    }

    public UserDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    public UserDto createUser(UserDto dto) {
        User user = new User();
        user.setUser(dto.user());
        user.setAge(dto.age());
        user.setRole(dto.role() != null ? dto.role() : Role.USER);
        user.setCreatedAt(dto.createdAt() != null ? dto.createdAt() : LocalDateTime.now());
        user.setLastAccess(dto.lastAccess() != null ? dto.lastAccess() : LocalDateTime.now());
        user.setExists(dto.exists() != null ? dto.exists() : true);
        return toDto(userRepository.save(user));
    }

    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        user.setUser(dto.user());
        user.setAge(dto.age());
        user.setRole(dto.role() != null ? dto.role() : user.getRole());
        user.setCreatedAt(dto.createdAt() != null ? dto.createdAt() : user.getCreatedAt());
        user.setLastAccess(dto.lastAccess() != null ? dto.lastAccess() : user.getLastAccess());
        user.setExists(dto.exists() != null ? dto.exists() : user.getExists());
        return toDto(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public UserDto updateLastAccess(Long id, LocalDateTime lastAccess) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        user.setLastAccess(lastAccess);
        return toDto(userRepository.save(user));
    }

    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUser(),
                user.getAge(),
                user.getRole(),
                user.getCreatedAt(),
                user.getLastAccess(),
                user.getExists()
        );
    }
}
