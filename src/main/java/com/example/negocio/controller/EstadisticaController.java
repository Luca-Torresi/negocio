package com.example.negocio.controller;

import com.example.negocio.service.EstadisticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/estadistica")
public class EstadisticaController {
    private final EstadisticaService estadisticaService;
}
