package com.example.demo.service;

import com.example.demo.dto.AdminDto;
import com.example.demo.model.Admin;
import com.example.demo.model.Role;
import com.example.demo.repository.AdminRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private AdminRepository adminRepository;

    @InjectMocks
    private AdminService adminService;

    private Admin admin1;

    @BeforeEach
    void setUp() {
        LocalDateTime now = LocalDateTime.now();
        admin1 = new Admin(1L, "admin", Role.ADMIN, now, now, true);
    }

    @Test
    void findByName_shouldReturnAdminDto_whenAdminExists() {
        when(adminRepository.findByName("admin")).thenReturn(Optional.of(admin1));

        Optional<AdminDto> result = adminService.findByName("admin");

        assertTrue(result.isPresent());
        assertEquals("admin", result.get().name());
        assertEquals(Role.ADMIN, result.get().role());
        assertTrue(result.get().active());
        verify(adminRepository, times(1)).findByName("admin");
    }

    @Test
    void findByName_shouldReturnEmptyOptional_whenAdminDoesNotExist() {
        when(adminRepository.findByName("nonexistent")).thenReturn(Optional.empty());

        Optional<AdminDto> result = adminService.findByName("nonexistent");

        assertFalse(result.isPresent());
        verify(adminRepository, times(1)).findByName("nonexistent");
    }

    @Test
    void updateLastAccess_shouldReturnUpdatedAdminDto_whenAdminExists() {
        LocalDateTime newLastAccess = LocalDateTime.now();
        Admin updatedAdmin = new Admin(1L, "admin", Role.ADMIN, admin1.getCreatedAt(), newLastAccess, true);

        when(adminRepository.findById(1L)).thenReturn(Optional.of(admin1));
        when(adminRepository.save(any(Admin.class))).thenReturn(updatedAdmin);

        AdminDto result = adminService.updateLastAccess(1L, newLastAccess);

        assertEquals(newLastAccess, result.lastAccess());
        assertEquals("admin", result.name());
        verify(adminRepository, times(1)).findById(1L);
        verify(adminRepository, times(1)).save(any(Admin.class));
    }

    @Test
    void updateLastAccess_shouldThrowException_whenAdminDoesNotExist() {
        LocalDateTime newLastAccess = LocalDateTime.now();

        when(adminRepository.findById(999L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> adminService.updateLastAccess(999L, newLastAccess)
        );

        assertEquals("Admin not found with id: 999", exception.getMessage());
        verify(adminRepository, times(1)).findById(999L);
        verify(adminRepository, never()).save(any(Admin.class));
    }
}
