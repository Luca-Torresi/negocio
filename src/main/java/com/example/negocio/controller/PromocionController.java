package com.example.negocio.controller;

import com.example.negocio.dto.promocion.PromocionAbmDTO;
import com.example.negocio.dto.promocion.PromocionDTO;
import com.example.negocio.dto.promocion.PromocionListaDTO;
import com.example.negocio.entity.Promocion;
import com.example.negocio.service.PromocionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/promocion")
public class PromocionController {
    private final PromocionService promocionService;

    @PostMapping("/nueva")
    public ResponseEntity<Promocion> nuevaPromocion(@RequestBody PromocionDTO dto) {
        return ResponseEntity.ok(promocionService.nuevaPromocion(dto));
    }

    @PutMapping("/modificar/{idPromocion}")
    public ResponseEntity<Promocion> modificarPromocion(@PathVariable Long idPromocion, @RequestBody PromocionDTO dto) {
        return ResponseEntity.ok(promocionService.modificarPromocion(idPromocion, dto));
    }

    @GetMapping("/abm")
    public ResponseEntity<List<PromocionAbmDTO>> obtenerPromociones(){
        return ResponseEntity.ok(promocionService.obtenerPromociones());
    }

    @GetMapping("/lista")
    public ResponseEntity<List<PromocionListaDTO>> listarPromociones(){
        return ResponseEntity.ok(promocionService.listarPromociones());
    }

    @PatchMapping("/cambiarEstado/{idPromocion}")
    public ResponseEntity<Void> cambiarEstadoPromocion(@PathVariable Long idPromocion) {
        promocionService.cambiarEstadoPromocion(idPromocion);
        return ResponseEntity.ok().build();
    }
}
