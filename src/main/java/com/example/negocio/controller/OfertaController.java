package com.example.negocio.controller;

import com.example.negocio.dto.oferta.OfertaDTO;
import com.example.negocio.entity.Oferta;
import com.example.negocio.service.OfertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/oferta")
public class OfertaController {
    private final OfertaService ofertaService;

    @PostMapping("/nueva")
    public ResponseEntity<Oferta> nuevaOferta(@RequestBody OfertaDTO dto) {
        return ResponseEntity.ok(ofertaService.nuevaOferta(dto));
    }

    @PutMapping("/modificar/{idOferta}")
    public ResponseEntity<Oferta> modificarOferta(@PathVariable Long idOferta, @RequestBody OfertaDTO dto) {
        return ResponseEntity.ok(ofertaService.modificarOferta(idOferta, dto));
    }

    @DeleteMapping("/eliminar/{idOferta}")
    public ResponseEntity<Void> eliminarOferta(@PathVariable Long idOferta){
        ofertaService.eliminarOferta(idOferta);
        return ResponseEntity.noContent().build();
    }

}
