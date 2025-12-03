package com.allpasoft.apijavabank.application.service;

import com.allpasoft.apijavabank.application.dto.AuthResponseDto;
import com.allpasoft.apijavabank.application.dto.LoginRequestDto;
import com.allpasoft.apijavabank.application.dto.UserDto;
import com.allpasoft.apijavabank.application.dto.UserRegisterDto;
import com.allpasoft.apijavabank.application.util.PasswordHasher;
import com.allpasoft.apijavabank.domain.entity.User;
import com.allpasoft.apijavabank.domain.entity.UserRole;
import com.allpasoft.apijavabank.domain.repository.UserRepository;
import com.allpasoft.apijavabank.infrastructure.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public Optional<AuthResponseDto> register(UserRegisterDto dto) {
        // Verificar si el usuario ya existe
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            return Optional.empty();
        }
        
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            return Optional.empty();
        }

        // Crear nuevo usuario
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(PasswordHasher.hashPassword(dto.getPassword()));
        user.setIsActive(true);
        user.setRole(UserRole.USER);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser);

        return Optional.of(new AuthResponseDto(token));
    }

    @Override
    public Optional<AuthResponseDto> login(LoginRequestDto dto) {
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(dto.getEmail());
        
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();
        
        if (!user.getIsActive() || !PasswordHasher.verifyPassword(dto.getPassword(), user.getPasswordHash())) {
            return Optional.empty();
        }

        String token = jwtUtil.generateToken(user);
        return Optional.of(new AuthResponseDto(token));
    }

    @Override
    public Optional<UserDto> getUserById(Long userId) {
        return userRepository.findById(userId).map(this::mapToDto);
    }

    @Override
    public Optional<UserDto> getMe(Long userId) {
        return userRepository.findById(userId).map(this::mapToDto);
    }

    private UserDto mapToDto(User user) {
        return new UserDto(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getUsername(),
            user.getEmail(),
            user.getIsActive(),
            user.getRole().ordinal()
        );
    }
}
