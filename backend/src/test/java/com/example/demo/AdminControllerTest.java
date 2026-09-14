package com.example.demo;

import com.example.demo.controller.AdminController;
import com.example.demo.dto.AdminDto;
import com.example.demo.dto.AdminLoginRequest;
import com.example.demo.dto.AdminLoginResponse;
import com.example.demo.model.Role;
import com.example.demo.service.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @Test
    void shouldLoginSuccessfully_withValidCredentials() throws Exception {
        LocalDateTime now = LocalDateTime.now();
        AdminDto admin = new AdminDto(1L, "admin", Role.ADMIN, now, now, true);
        AdminLoginRequest request = new AdminLoginRequest("admin", Role.ADMIN);

        given(adminService.findByName("admin")).willReturn(Optional.of(admin));
        given(adminService.updateLastAccess(eq(1L), any(LocalDateTime.class))).willReturn(admin);

        mockMvc.perform(post("/api/admin/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"admin\",\"role\":\"ADMIN\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Login successful"))
            .andExpect(jsonPath("$.name").value("admin"))
            .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void shouldReturn403_whenAdminNotFound() throws Exception {
        given(adminService.findByName("nonexistent")).willReturn(Optional.empty());

        mockMvc.perform(post("/api/admin/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"nonexistent\",\"role\":\"ADMIN\"}"))
            .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn403_whenAdminAccountInactive() throws Exception {
        LocalDateTime now = LocalDateTime.now();
        AdminDto admin = new AdminDto(1L, "admin", Role.ADMIN, now, now, false);

        given(adminService.findByName("admin")).willReturn(Optional.of(admin));

        mockMvc.perform(post("/api/admin/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"admin\",\"role\":\"ADMIN\"}"))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Admin account is inactive"));
    }

    @Test
    void shouldReturn403_whenRoleDoesNotMatch() throws Exception {
        LocalDateTime now = LocalDateTime.now();
        AdminDto admin = new AdminDto(1L, "admin", Role.ADMIN, now, now, true);

        given(adminService.findByName("admin")).willReturn(Optional.of(admin));

        mockMvc.perform(post("/api/admin/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"admin\",\"role\":\"USER\"}"))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Role does not match admin account"));
    }
}
