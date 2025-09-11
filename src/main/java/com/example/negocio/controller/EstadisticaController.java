package com.example.negocio.controller;

import com.example.negocio.dto.estadisticas.KpiDTO;
import com.example.negocio.service.EstadisticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/estadistica")
public class EstadisticaController {
    private final EstadisticaService estadisticaService;

    @GetMapping("/ingresosVsEgresos")
    public ResponseEntity<List<List<Object>>> ingresosVsEgresos(
            @RequestParam LocalDate fechaInicio,
            @RequestParam LocalDate fechaFin) {
        return ResponseEntity.ok(estadisticaService.ingresosVsEgresos(fechaInicio, fechaFin));
    }

    @GetMapping("/ventasPorMetodoDePago")
    public ResponseEntity<List<List<Object>>> ventasPorMetodoDePago(
            @RequestParam LocalDate fechaInicio,
            @RequestParam LocalDate fechaFin){
        return ResponseEntity.ok(estadisticaService.ventasPorMetodoDePago(fechaInicio, fechaFin));
    }

    @GetMapping("/productosRentables")
    public ResponseEntity<List<List<Object>>> productosMasRentables(
            @RequestParam LocalDate fechaInicio,
            @RequestParam LocalDate fechaFin){
        return ResponseEntity.ok(estadisticaService.productosMasRentables(fechaInicio, fechaFin));
    }

    @GetMapping("/volumenVentas")
    public ResponseEntity<List<List<Object>>> volumenVentas(
            @RequestParam LocalDate fechaInicio,
            @RequestParam LocalDate fechaFin,
            @RequestParam(required = false) Long idProducto) {
        return ResponseEntity.ok(estadisticaService.volumenVentas(fechaInicio, fechaFin, idProducto));
    }

    @GetMapping("/ventasPorHora")
    public ResponseEntity<List<List<Object>>> ventasPorHora(
            @RequestParam LocalDate fechaInicio,
            @RequestParam LocalDate fechaFin){
        return ResponseEntity.ok(estadisticaService.ventasPorHora(fechaInicio, fechaFin));
    }

    @GetMapping("/kpis")
    public ResponseEntity<List<KpiDTO>> obtenerKpis(){
        return ResponseEntity.ok(estadisticaService.obtenerKpis());
    }
}
