package com.example.demo.config;

import com.example.demo.model.Admin;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, AdminRepository adminRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User(null, "haku", 3, Role.ADMIN, LocalDateTime.now(), LocalDateTime.now(), true));
                userRepository.save(new User(null, "ava", 27, Role.USER, LocalDateTime.now().minusDays(2), LocalDateTime.now().minusDays(1), true));
                userRepository.save(new User(null, "leo", 19, Role.USER, LocalDateTime.now().minusWeeks(1), LocalDateTime.now().minusWeeks(1), false));
            }

            if (adminRepository.count() == 0) {
                adminRepository.save(new Admin(null, "admin", Role.ADMIN, LocalDateTime.now(), LocalDateTime.now(), true));
                adminRepository.save(new Admin(null, "operator", Role.USER, LocalDateTime.now().minusDays(5), LocalDateTime.now().minusDays(1), true));
            }
        };
    }
}
