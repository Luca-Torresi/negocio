package com.example.negocio.controller;

import com.example.negocio.dto.compra.CompraDTO;
import com.example.negocio.dto.compra.CompraFullDTO;
import com.example.negocio.entity.Compra;
import com.example.negocio.service.CompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/compra")
public class CompraController {
    private final CompraService compraService;

    @PostMapping("/nueva")
    public Compra nuevaCompra(@RequestBody CompraDTO dto) {
        return compraService.nuevaCompra(dto);
    }

    @GetMapping("/obtener")
    public Page<CompraFullDTO> obtenerCompras(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) LocalDate fechaInicio,
            @RequestParam(required = false) LocalDate fechaFin,
            @RequestParam(required = false) Long idProveedor) {
        return compraService.obtenerCompras(page, size, fechaInicio, fechaFin, idProveedor);
    }

}
