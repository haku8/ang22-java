package com.example.demo.dto;

import com.example.demo.model.Role;
import java.time.LocalDateTime;

public record AdminDto(Long id, String name, Role role, LocalDateTime createdAt, LocalDateTime lastAccess, Boolean active) {
}
