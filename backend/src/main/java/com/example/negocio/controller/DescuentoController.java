package com.example.negocio.controller;

import com.example.negocio.dto.descuento.DescuentoDTO;
import com.example.negocio.entity.Descuento;
import com.example.negocio.service.DescuentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/descuento")
public class DescuentoController {
    private final DescuentoService descuentoService;

    @PostMapping("/nuevo")
    public ResponseEntity<Descuento> nuevoDescuento(@Valid @RequestBody DescuentoDTO dto) {
        return ResponseEntity.ok(descuentoService.nuevoDescuento(dto));
    }

    @PutMapping("/modificar/{idDescuento}")
    public ResponseEntity<Descuento> modificarDescuento(
            @PathVariable Long idDescuento,
            @Valid @RequestBody DescuentoDTO dto) {
        return ResponseEntity.ok(descuentoService.modificarDescuento(idDescuento, dto));
    }

    @DeleteMapping("/eliminar/{idDescuento}")
    public ResponseEntity<Void> eliminarDescuento(@PathVariable Long idDescuento){
        descuentoService.eliminarDescuento(idDescuento);
        return ResponseEntity.noContent().build();
    }
}
