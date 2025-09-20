package com.example.negocio.controller;

import com.example.negocio.dto.compra.CompraDTO;
import com.example.negocio.dto.compra.CompraFullDTO;
import com.example.negocio.entity.Compra;
import com.example.negocio.service.CompraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/compra")
public class CompraController {
    private final CompraService compraService;

    @PostMapping("/nueva")
    public Compra nuevaCompra(
            @RequestHeader("X-Usuario-ID") Long idUsuario,
            @Valid @RequestBody CompraDTO dto) {
        return compraService.nuevaCompra(idUsuario, dto);
    }

    @GetMapping("/obtener")
    public Page<CompraFullDTO> obtenerCompras(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) LocalDate fechaInicio,
            @RequestParam(required = false) LocalDate fechaFin,
            @RequestParam(required = false) Long idProveedor,
            @RequestParam(required = false) Long idUsuario) {
        return compraService.obtenerCompras(page, size, fechaInicio, fechaFin, idProveedor, idUsuario);
    }

}
