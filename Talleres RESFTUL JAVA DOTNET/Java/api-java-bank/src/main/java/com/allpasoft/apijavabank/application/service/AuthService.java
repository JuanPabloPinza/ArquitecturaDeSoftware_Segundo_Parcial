package com.allpasoft.apijavabank.application.service;

import com.allpasoft.apijavabank.application.dto.AuthResponseDto;
import com.allpasoft.apijavabank.application.dto.LoginRequestDto;
import com.allpasoft.apijavabank.application.dto.UserDto;
import com.allpasoft.apijavabank.application.dto.UserRegisterDto;

import java.util.Optional;

public interface AuthService {
    Optional<AuthResponseDto> register(UserRegisterDto dto);
    Optional<AuthResponseDto> login(LoginRequestDto dto);
    Optional<UserDto> getUserById(Long userId);
    Optional<UserDto> getMe(Long userId);
}
