package com.example.demo.service;

import com.example.demo.dto.UserDto;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user1;
    private User user2;
    private UserDto userDto1;

    @BeforeEach
    void setUp() {
        LocalDateTime now = LocalDateTime.now();
        user1 = new User(1L, "Alice", 30, Role.USER, now, now, true);
        user2 = new User(2L, "Bob", 25, Role.ADMIN, now, now, true);
        userDto1 = new UserDto(1L, "Alice", 30, Role.USER, now, now, true);
    }

    @Test
    void getAllUsers_shouldReturnListOfUserDtos() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        List<UserDto> result = userService.getAllUsers();

        assertEquals(2, result.size());
        assertEquals("Alice", result.get(0).user());
        assertEquals("Bob", result.get(1).user());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getAllUsers_shouldReturnEmptyList_whenNoUsersExist() {
        when(userRepository.findAll()).thenReturn(Arrays.asList());

        List<UserDto> result = userService.getAllUsers();

        assertTrue(result.isEmpty());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void findByName_shouldReturnUserDto_whenUserExists() {
        when(userRepository.findByUser("Alice")).thenReturn(Optional.of(user1));

        Optional<UserDto> result = userService.findByName("Alice");

        assertTrue(result.isPresent());
        assertEquals("Alice", result.get().user());
        verify(userRepository, times(1)).findByUser("Alice");
    }

    @Test
    void findByName_shouldReturnEmptyOptional_whenUserDoesNotExist() {
        when(userRepository.findByUser("NonExistent")).thenReturn(Optional.empty());

        Optional<UserDto> result = userService.findByName("NonExistent");

        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByUser("NonExistent");
    }

    @Test
    void getUserById_shouldReturnUserDto_whenUserExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));

        UserDto result = userService.getUserById(1L);

        assertEquals("Alice", result.user());
        assertEquals(30, result.age());
        assertEquals(Role.USER, result.role());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void getUserById_shouldThrowException_whenUserDoesNotExist() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.getUserById(999L)
        );

        assertEquals("User not found with id: 999", exception.getMessage());
        verify(userRepository, times(1)).findById(999L);
    }

    @Test
    void createUser_shouldReturnUserDto_withDefaultValues() {
        UserDto inputDto = new UserDto(null, "Charlie", 35, null, null, null, null);
        User savedUser = new User(3L, "Charlie", 35, Role.USER, LocalDateTime.now(), LocalDateTime.now(), true);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDto result = userService.createUser(inputDto);

        assertNotNull(result);
        assertEquals("Charlie", result.user());
        assertEquals(35, result.age());
        assertEquals(Role.USER, result.role());
        assertTrue(result.exists());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_shouldUseProvidedValues_whenAllFieldsPresent() {
        LocalDateTime now = LocalDateTime.now();
        UserDto inputDto = new UserDto(null, "David", 40, Role.ADMIN, now, now, false);
        User savedUser = new User(4L, "David", 40, Role.ADMIN, now, now, false);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDto result = userService.createUser(inputDto);

        assertEquals("David", result.user());
        assertEquals(40, result.age());
        assertEquals(Role.ADMIN, result.role());
        assertFalse(result.exists());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_shouldReturnUpdatedUserDto_whenUserExists() {
        LocalDateTime now = LocalDateTime.now();
        UserDto updateDto = new UserDto(null, "Alice Updated", 31, Role.ADMIN, now, now, false);
        User updatedUser = new User(1L, "Alice Updated", 31, Role.ADMIN, now, now, false);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        UserDto result = userService.updateUser(1L, updateDto);

        assertEquals("Alice Updated", result.user());
        assertEquals(31, result.age());
        assertEquals(Role.ADMIN, result.role());
        assertFalse(result.exists());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_shouldPreserveExistingValues_whenFieldsAreNull() {
        LocalDateTime now = LocalDateTime.now();
        UserDto updateDto = new UserDto(null, "Alice Updated", null, null, null, null, null);
        User updatedUser = new User(1L, "Alice Updated", 30, Role.USER, now, now, true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        UserDto result = userService.updateUser(1L, updateDto);

        assertEquals("Alice Updated", result.user());
        assertEquals(30, result.age());
        assertEquals(Role.USER, result.role());
        assertTrue(result.exists());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_shouldThrowException_whenUserDoesNotExist() {
        UserDto updateDto = new UserDto(null, "NonExistent", 30, Role.USER, null, null, true);

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.updateUser(999L, updateDto)
        );

        assertEquals("User not found with id: 999", exception.getMessage());
        verify(userRepository, times(1)).findById(999L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_shouldCallRepositoryDeleteById() {
        doNothing().when(userRepository).deleteById(1L);

        userService.deleteUser(1L);

        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void updateLastAccess_shouldReturnUpdatedUserDto_whenUserExists() {
        LocalDateTime newLastAccess = LocalDateTime.now();
        User updatedUser = new User(1L, "Alice", 30, Role.USER, user1.getCreatedAt(), newLastAccess, true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        UserDto result = userService.updateLastAccess(1L, newLastAccess);

        assertEquals(newLastAccess, result.lastAccess());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateLastAccess_shouldThrowException_whenUserDoesNotExist() {
        LocalDateTime newLastAccess = LocalDateTime.now();

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.updateLastAccess(999L, newLastAccess)
        );

        assertEquals("User not found with id: 999", exception.getMessage());
        verify(userRepository, times(1)).findById(999L);
        verify(userRepository, never()).save(any(User.class));
    }
}
