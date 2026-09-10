package com.example.demo.dto;

import com.example.demo.model.Role;

public record AdminLoginRequest(String name, Role role) {
}
