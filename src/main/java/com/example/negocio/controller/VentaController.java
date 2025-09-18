package com.example.negocio.controller;

import com.example.negocio.dto.venta.CatalogoDTO;
import com.example.negocio.dto.venta.VentaDTO;
import com.example.negocio.dto.venta.VentaListaDTO;
import com.example.negocio.entity.Venta;
import com.example.negocio.enums.MetodoDePago;
import com.example.negocio.service.VentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/venta")
public class VentaController {
    private final VentaService ventaService;

    @PostMapping("/nueva")
    public ResponseEntity<Venta> nuevaVenta(
            @RequestHeader("X-Usuario-ID") Long idUsuario,
            @Valid @RequestBody VentaDTO dto) {
        return ResponseEntity.ok(ventaService.nuevaVenta(idUsuario, dto));
    }

    @GetMapping("/catalogo")
    public ResponseEntity<List<CatalogoDTO>> obtenerCatalogo() {
        return ResponseEntity.ok(ventaService.obtenerCatalogo());
    }

    @GetMapping("/obtener")
    public Page<VentaListaDTO> obtenerVentas(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) LocalDate fechaInicio,
            @RequestParam(required = false) LocalDate fechaFin,
            @RequestParam(required = false) Long idUsuario,
            @RequestParam(required = false) MetodoDePago metodoDePago) {
        return ventaService.obtenerVentas(page, size, fechaInicio, fechaFin, idUsuario, metodoDePago);
    }

    @GetMapping("/metodosDePago")
    public ResponseEntity<List<String>> listarMetodosDePago(){
        return ResponseEntity.ok(ventaService.listarMetodosDePago());
    }

}
