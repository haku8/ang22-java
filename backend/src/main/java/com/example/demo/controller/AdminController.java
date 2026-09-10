package com.example.demo.controller;

import com.example.demo.dto.AdminLoginRequest;
import com.example.demo.dto.AdminLoginResponse;
import com.example.demo.dto.AdminDto;
import com.example.demo.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Admin login and auth operations")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    @Operation(summary = "Admin login", description = "Login with admin credentials")
    @ApiResponse(responseCode = "200", description = "Login response")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody AdminLoginRequest request) {
        AdminDto admin = adminService.findByName(request.name())
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        if (!admin.active()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new AdminLoginResponse(false, "Admin account is inactive", null, null));
        }

        if (!admin.role().equals(request.role())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new AdminLoginResponse(false, "Role does not match admin account", null, null));
        }

        admin = adminService.updateLastAccess(admin.id(), LocalDateTime.now());
        return ResponseEntity.ok(new AdminLoginResponse(true, "Login successful", admin.name(), admin.role()));
    }
}
