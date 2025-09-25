package com.example.negocio.controller;

import com.example.negocio.dto.compra.CompraDTO;
import com.example.negocio.dto.compra.CompraFullDTO;
import com.example.negocio.entity.Compra;
import com.example.negocio.service.CompraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
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

    @GetMapping("/comprobante/{idCompra}")
    public ResponseEntity<InputStreamResource> descargarComprobante(@PathVariable Long idCompra) throws IOException {
        ByteArrayInputStream pdf = compraService.generarComprobantePdf(idCompra);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=ComprobanteCompra#" + idCompra + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }
}
