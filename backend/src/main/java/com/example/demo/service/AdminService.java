package com.example.demo.service;

import com.example.demo.dto.AdminDto;
import com.example.demo.model.Admin;
import com.example.demo.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Optional<AdminDto> findByName(String name) {
        return adminRepository.findByName(name).map(this::toDto);
    }

    public AdminDto updateLastAccess(Long id, LocalDateTime lastAccess) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with id: " + id));
        admin.setLastAccess(lastAccess);
        return toDto(adminRepository.save(admin));
    }

    private AdminDto toDto(Admin admin) {
        return new AdminDto(
                admin.getId(),
                admin.getName(),
                admin.getRole(),
                admin.getCreatedAt(),
                admin.getLastAccess(),
                admin.getActive()
        );
    }
}
