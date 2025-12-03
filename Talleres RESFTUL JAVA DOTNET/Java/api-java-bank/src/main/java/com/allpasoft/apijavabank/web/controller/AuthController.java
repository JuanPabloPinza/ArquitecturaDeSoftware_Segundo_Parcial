package com.allpasoft.apijavabank.web.controller;

import com.allpasoft.apijavabank.application.dto.AuthResponseDto;
import com.allpasoft.apijavabank.application.dto.LoginRequestDto;
import com.allpasoft.apijavabank.application.dto.UserDto;
import com.allpasoft.apijavabank.application.dto.UserRegisterDto;
import com.allpasoft.apijavabank.application.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Endpoints para registro, login y gestión de usuarios")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(
        summary = "Registrar nuevo usuario",
        description = "Crea un nuevo usuario en el sistema",
        responses = {
            @ApiResponse(responseCode = "200", description = "Usuario registrado exitosamente"),
            @ApiResponse(responseCode = "400", description = "El usuario o email ya existe")
        }
    )
    public ResponseEntity<Object> register(@RequestBody UserRegisterDto dto) {
        return authService.register(dto)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("El usuario o email ya existe"));
    }

    @PostMapping("/login")
    @Operation(
        summary = "Iniciar sesión",
        description = "Autenticar usuario y obtener token JWT",
        responses = {
            @ApiResponse(responseCode = "200", description = "Login exitoso"),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
        }
    )
    public ResponseEntity<Object> login(@RequestBody LoginRequestDto dto) {
        return authService.login(dto)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).body("Credenciales inválidas"));
    }

    @GetMapping("/me")
    @Operation(
        summary = "Obtener usuario actual",
        description = "Obtiene la información del usuario autenticado",
        security = @SecurityRequirement(name = "bearerAuth"),
        responses = {
            @ApiResponse(responseCode = "200", description = "Usuario obtenido exitosamente"),
            @ApiResponse(responseCode = "401", description = "Token inválido"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
        }
    )
    public ResponseEntity<?> getMe(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).body("Token inválido");
        }

        Long userId = (Long) authentication.getPrincipal();
        
        return authService.getMe(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
