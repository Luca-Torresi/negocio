package com.example.negocio.controller;

import com.example.negocio.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reporte")
public class ReporteController {
    private final ReporteService reporteService;

    @GetMapping("/diario")
    public ResponseEntity<InputStreamResource> exportarVentasDiarias(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) throws IOException {
        ByteArrayInputStream stream = reporteService.generarExcelVentasDiario(fecha);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=VentasDiarias " + fecha + ".xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/mensual")
    public ResponseEntity<InputStreamResource> exportarResumenMensual(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) throws IOException {
        ByteArrayInputStream stream = reporteService.generarExcelMensual(fecha);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=ResumenMensual " + fecha.getMonth() + ".xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

}
