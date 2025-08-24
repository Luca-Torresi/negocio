package com.example.negocio.controller;

import com.example.negocio.dto.descuento.DescuentoAbmDTO;
import com.example.negocio.dto.descuento.DescuentoDTO;
import com.example.negocio.entity.Descuento;
import com.example.negocio.service.DescuentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/descuento")
public class DescuentoController {
    private final DescuentoService descuentoService;

    @PostMapping("/nuevo")
    public ResponseEntity<Descuento> nuevoDescuento(@RequestBody DescuentoDTO dto) {
        return ResponseEntity.ok(descuentoService.nuevoDescuento(dto));
    }

    @PutMapping("/modificar/{idDescuento}")
    public ResponseEntity<Descuento> modificarDescuento(@PathVariable Long idDescuento, @RequestBody DescuentoDTO dto) {
        return ResponseEntity.ok(descuentoService.modificarDescuento(idDescuento, dto));
    }

    @GetMapping("/abm")
    public ResponseEntity<List<DescuentoAbmDTO>> obtenerDescuentos(){
        return ResponseEntity.ok(descuentoService.obtenerDescuentos());
    }

    @DeleteMapping("/eliminar/{idDescuento}")
    public ResponseEntity<Void> eliminarDescuento(@PathVariable Long idDescuento){
        descuentoService.eliminarDescuento(idDescuento);
        return ResponseEntity.noContent().build();
    }
}
