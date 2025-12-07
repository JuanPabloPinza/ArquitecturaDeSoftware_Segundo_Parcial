package com.allpasoft.apijavabank.web.controller;

import com.allpasoft.apijavabank.application.dto.AccountDto;
import com.allpasoft.apijavabank.application.dto.CreateAccountDto;
import com.allpasoft.apijavabank.application.dto.UpdateAccountDto;
import com.allpasoft.apijavabank.application.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@Tag(name = "Cuentas", description = "Endpoints para gestión de cuentas bancarias")
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    @Operation(
        summary = "Listar todas las cuentas",
        description = "Obtiene la lista de todas las cuentas bancarias",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de cuentas obtenida exitosamente")
        }
    )
    public ResponseEntity<List<AccountDto>> getAll() {
        return ResponseEntity.ok(accountService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Obtener cuenta por ID",
        description = "Obtiene una cuenta bancaria por su ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Cuenta obtenida exitosamente"),
            @ApiResponse(responseCode = "404", description = "Cuenta no encontrada")
        }
    )
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        return accountService.getById(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("Cuenta no encontrada"));
    }

    @GetMapping("/user/{userId}")
    @Operation(
        summary = "Obtener cuentas por usuario",
        description = "Obtiene todas las cuentas de un usuario",
        responses = {
            @ApiResponse(responseCode = "200", description = "Cuentas obtenidas exitosamente")
        }
    )
    public ResponseEntity<List<AccountDto>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(accountService.getByUserId(userId));
    }

    @PostMapping
    @Operation(
        summary = "Crear cuenta",
        description = "Crea una nueva cuenta bancaria",
        responses = {
            @ApiResponse(responseCode = "201", description = "Cuenta creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "No se pudo crear la cuenta")
        }
    )
    public ResponseEntity<Object> create(@RequestBody CreateAccountDto dto) {
        return accountService.create(dto)
                .<ResponseEntity<Object>>map(account -> ResponseEntity.created(URI.create("/api/account/" + account.getId())).body(account))
                .orElse(ResponseEntity.badRequest().body("No se pudo crear la cuenta. Verifique que el usuario exista."));
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Actualizar cuenta",
        description = "Actualiza una cuenta bancaria existente",
        responses = {
            @ApiResponse(responseCode = "200", description = "Cuenta actualizada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Cuenta no encontrada")
        }
    )
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody UpdateAccountDto dto) {
        return accountService.update(id, dto)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("Cuenta no encontrada"));
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Eliminar cuenta",
        description = "Elimina una cuenta bancaria",
        responses = {
            @ApiResponse(responseCode = "204", description = "Cuenta eliminada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Cuenta no encontrada")
        }
    )
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        if (accountService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(404).body("Cuenta no encontrada");
    }
}
