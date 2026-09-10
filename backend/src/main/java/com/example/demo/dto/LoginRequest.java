package com.example.demo.dto;

import com.example.demo.model.Role;

public record LoginRequest(String name, Role role) {
}
