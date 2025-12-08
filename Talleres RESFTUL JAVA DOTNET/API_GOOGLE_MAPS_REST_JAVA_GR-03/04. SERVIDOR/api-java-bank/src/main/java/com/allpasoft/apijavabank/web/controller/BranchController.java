package com.allpasoft.apijavabank.web.controller;

import com.allpasoft.apijavabank.application.dto.BranchDto;
import com.allpasoft.apijavabank.application.dto.CreateBranchDto;
import com.allpasoft.apijavabank.application.dto.UpdateBranchDto;
import com.allpasoft.apijavabank.application.service.BranchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/branch")
@RequiredArgsConstructor
@Tag(name = "Sucursales", description = "Endpoints para gestión de sucursales")
public class BranchController {

    private final BranchService branchService;

    @GetMapping
    @Operation(
        summary = "Listar todas las sucursales",
        description = "Obtiene la lista de todas las sucursales",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de sucursales obtenida exitosamente")
        }
    )
    public ResponseEntity<List<BranchDto>> getAll() {
        return ResponseEntity.ok(branchService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Obtener sucursal por ID",
        description = "Obtiene una sucursal por su ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Sucursal obtenida exitosamente"),
            @ApiResponse(responseCode = "404", description = "Sucursal no encontrada")
        }
    )
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        return branchService.getById(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("Sucursal no encontrada"));
    }

    @PostMapping
    @Operation(
        summary = "Crear sucursal",
        description = "Crea una nueva sucursal",
        responses = {
            @ApiResponse(responseCode = "201", description = "Sucursal creada exitosamente")
        }
    )
    public ResponseEntity<BranchDto> create(@RequestBody CreateBranchDto dto) {
        BranchDto branch = branchService.create(dto);
        return ResponseEntity.created(URI.create("/api/branch/" + branch.getId())).body(branch);
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Actualizar sucursal",
        description = "Actualiza una sucursal existente",
        responses = {
            @ApiResponse(responseCode = "200", description = "Sucursal actualizada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Sucursal no encontrada")
        }
    )
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody UpdateBranchDto dto) {
        return branchService.update(id, dto)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("Sucursal no encontrada"));
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Eliminar sucursal",
        description = "Elimina una sucursal existente",
        responses = {
            @ApiResponse(responseCode = "204", description = "Sucursal eliminada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Sucursal no encontrada")
        }
    )
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        if (branchService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(404).body("Sucursal no encontrada");
    }
}
