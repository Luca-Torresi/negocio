package com.example.negocio.controller;

import com.example.negocio.dto.marca.MarcaDTO;
import com.example.negocio.dto.marca.MarcaListaDTO;
import com.example.negocio.entity.Marca;
import com.example.negocio.service.MarcaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/marca")
public class MarcaController {
    private final MarcaService marcaService;

    @PostMapping("/nueva")
    public ResponseEntity<Marca> nuevaMarca(@Valid @RequestBody MarcaDTO dto) {
        return ResponseEntity.ok(marcaService.nuevaMarca(dto));
    }

    @PutMapping("/modificar/{idMarca}")
    public ResponseEntity<Marca> modificarMarca(@PathVariable Long idMarca, @Valid @RequestBody MarcaDTO dto) {
        return ResponseEntity.ok(marcaService.modificarMarca(idMarca, dto));
    }

    @GetMapping("/lista")
    public ResponseEntity<List<MarcaListaDTO>> listarMarcas(){
        return ResponseEntity.ok(marcaService.listarMarcas());
    }

}
