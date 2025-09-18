package com.example.negocio.controller;

import com.example.negocio.dto.proveedor.ProveedorAbmDTO;
import com.example.negocio.dto.proveedor.ProveedorDTO;
import com.example.negocio.dto.proveedor.ProveedorListaDTO;
import com.example.negocio.entity.Proveedor;
import com.example.negocio.service.ProveedorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/proveedor")
public class ProveedorController {
    private final ProveedorService proveedorService;

    @PostMapping("/nuevo")
    public ResponseEntity<Proveedor> nuevoProveedor(@Valid @RequestBody ProveedorDTO dto) {
        return ResponseEntity.ok(proveedorService.nuevoProveedor(dto));
    }

    @PutMapping("/modificar/{idProveedor}")
    public ResponseEntity<Proveedor> modificarProveedor(
            @PathVariable Long idProveedor,
            @Valid @RequestBody ProveedorDTO dto) {
        return ResponseEntity.ok(proveedorService.modificarProveedor(idProveedor, dto));
    }

    @GetMapping("/abm")
    public ResponseEntity<List<ProveedorAbmDTO>> obtenerProveedores(){
        return ResponseEntity.ok(proveedorService.obtenerProveedores());
    }

    @GetMapping("/lista")
    public ResponseEntity<List<ProveedorListaDTO>> listarProveedores(){
        return ResponseEntity.ok(proveedorService.listarProveedores());
    }

    @PatchMapping("/cambiarEstado/{idProveedor}")
    public ResponseEntity<Void> cambiarEstadoProveedor(@PathVariable Long idProveedor){
        proveedorService.cambiarEstadoProveedor(idProveedor);
        return ResponseEntity.ok().build();
    }

}
