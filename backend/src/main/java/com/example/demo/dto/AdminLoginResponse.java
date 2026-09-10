package com.example.demo.dto;

import com.example.demo.model.Role;

public record AdminLoginResponse(boolean success, String message, String name, Role role) {
}
