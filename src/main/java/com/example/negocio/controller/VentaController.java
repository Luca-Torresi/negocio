package com.example.negocio.controller;

import com.example.negocio.dto.venta.VentaDTO;
import com.example.negocio.dto.venta.VentaListaDTO;
import com.example.negocio.entity.Venta;
import com.example.negocio.service.VentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/venta")
public class VentaController {
    private final VentaService ventaService;

    @PostMapping("/nueva")
    public ResponseEntity<Venta> nuevaVenta(@RequestBody VentaDTO dto) {
        return ResponseEntity.ok(ventaService.nuevaVenta(dto));
    }

    @GetMapping("/obtener")
    public Page<VentaListaDTO> obtenerVentas(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) LocalDate fechaInicio,
            @RequestParam(required = false) LocalDate fechaFin) {
        return ventaService.obtenerVentas(page, size, fechaInicio, fechaFin);
    }

}
