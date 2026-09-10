package com.example.demo.dto;

import com.example.demo.model.Role;
import java.time.LocalDateTime;

public record UserDto(Long id, String user, Integer age, Role role, LocalDateTime createdAt, LocalDateTime lastAccess, Boolean exists) {
}
