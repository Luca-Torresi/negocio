package com.example.negocio.controller;

import com.example.negocio.dto.categoria.CategoriaAbmDTO;
import com.example.negocio.dto.categoria.CategoriaDTO;
import com.example.negocio.entity.Categoria;
import com.example.negocio.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categoria")
public class CategoriaController {
    private final CategoriaService categoriaService;

    @PostMapping("/nueva")
    public ResponseEntity<Categoria> nuevaCategoria(@Valid @RequestBody CategoriaDTO dto) {
        return ResponseEntity.ok(categoriaService.nuevaCategoria(dto));
    }

    @PutMapping("/modificar/{idCategoria}")
    public ResponseEntity<Categoria> modificarCategoria(
            @PathVariable Long idCategoria,
            @Valid @RequestBody CategoriaDTO dto) {
        return ResponseEntity.ok(categoriaService.modificarCategoria(idCategoria, dto));
    }

    @GetMapping("/abm")
    public ResponseEntity<List<CategoriaAbmDTO>> obtenerCategorias(){
        return ResponseEntity.ok(categoriaService.obtenerCategorias());
    }

    @PatchMapping("/cambiarEstado/{idCategoria}")
    public ResponseEntity<Void> cambiarEstadoCategoria(@PathVariable Long idCategoria) {
        categoriaService.cambiarEstadoCategoria(idCategoria);
        return ResponseEntity.ok().build();
    }

}
