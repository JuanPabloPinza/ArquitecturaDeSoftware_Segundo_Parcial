package com.allpasoft.apijavabank.web.controller;

import com.allpasoft.apijavabank.application.dto.*;
import com.allpasoft.apijavabank.application.service.TransactionService;
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
@RequestMapping("/api/transaction")
@RequiredArgsConstructor
@Tag(name = "Transacciones", description = "Endpoints para depósitos, retiros y transferencias")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @Operation(
        summary = "Listar todas las transacciones",
        description = "Obtiene la lista de todas las transacciones",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de transacciones obtenida exitosamente")
        }
    )
    public ResponseEntity<List<TransactionDto>> getAll() {
        return ResponseEntity.ok(transactionService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Obtener transacción por ID",
        description = "Obtiene una transacción por su ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Transacción obtenida exitosamente"),
            @ApiResponse(responseCode = "404", description = "Transacción no encontrada")
        }
    )
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        return transactionService.getById(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("Transacción no encontrada"));
    }

    @GetMapping("/account/{accountId}")
    @Operation(
        summary = "Obtener transacciones por cuenta",
        description = "Obtiene todas las transacciones de una cuenta",
        responses = {
            @ApiResponse(responseCode = "200", description = "Transacciones obtenidas exitosamente")
        }
    )
    public ResponseEntity<List<TransactionDto>> getByAccountId(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getByAccountId(accountId));
    }

    @PostMapping("/deposit")
    @Operation(
        summary = "Realizar depósito",
        description = "Realiza un depósito en una cuenta",
        responses = {
            @ApiResponse(responseCode = "201", description = "Depósito realizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "No se pudo realizar el depósito")
        }
    )
    public ResponseEntity<Object> deposit(@RequestBody CreateDepositDto dto) {
        return transactionService.deposit(dto)
                .<ResponseEntity<Object>>map(t -> ResponseEntity.created(URI.create("/api/transaction/" + t.getId())).body(t))
                .orElse(ResponseEntity.badRequest().body("No se pudo realizar el depósito. Verifique que la cuenta exista y esté activa."));
    }

    @PostMapping("/withdrawal")
    @Operation(
        summary = "Realizar retiro",
        description = "Realiza un retiro de una cuenta",
        responses = {
            @ApiResponse(responseCode = "201", description = "Retiro realizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "No se pudo realizar el retiro")
        }
    )
    public ResponseEntity<Object> withdraw(@RequestBody CreateWithdrawalDto dto) {
        return transactionService.withdraw(dto)
                .<ResponseEntity<Object>>map(t -> ResponseEntity.created(URI.create("/api/transaction/" + t.getId())).body(t))
                .orElse(ResponseEntity.badRequest().body("No se pudo realizar el retiro. Verifique que la cuenta exista, esté activa y tenga saldo suficiente."));
    }

    @PostMapping("/transfer")
    @Operation(
        summary = "Realizar transferencia",
        description = "Realiza una transferencia entre cuentas",
        responses = {
            @ApiResponse(responseCode = "201", description = "Transferencia realizada exitosamente"),
            @ApiResponse(responseCode = "400", description = "No se pudo realizar la transferencia")
        }
    )
    public ResponseEntity<Object> transfer(@RequestBody CreateTransferDto dto) {
        return transactionService.transfer(dto)
                .<ResponseEntity<Object>>map(t -> ResponseEntity.created(URI.create("/api/transaction/" + t.getId())).body(t))
                .orElse(ResponseEntity.badRequest().body("No se pudo realizar la transferencia. Verifique que ambas cuentas existan, estén activas y la cuenta origen tenga saldo suficiente."));
    }
}
