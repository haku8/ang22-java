package com.example.demo;

import com.example.demo.controller.UserController;
import com.example.demo.dto.UserDto;
import com.example.demo.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldCreateUser() throws Exception {
        UserDto created = new UserDto(1L, "Ada", 37, com.example.demo.model.Role.USER, java.time.LocalDateTime.now(), java.time.LocalDateTime.now(), true);
        given(userService.createUser(any(UserDto.class))).willReturn(created);

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"user\":\"Ada\",\"age\":37,\"role\":\"USER\",\"createdAt\":\"2024-01-01T10:00:00\",\"lastAccess\":\"2024-01-01T10:00:00\",\"exists\":true}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.user").value("Ada"));
    }

    @Test
    void shouldGetUserById() throws Exception {
        UserDto user = new UserDto(1L, "Ada", 37, com.example.demo.model.Role.USER, java.time.LocalDateTime.now(), java.time.LocalDateTime.now(), true);
        given(userService.getUserById(1L)).willReturn(user);

        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.user").value("Ada"));
    }

    @Test
    void shouldDeleteUser() throws Exception {
        Mockito.doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/users/1"))
            .andExpect(status().isNoContent());
    }
}
