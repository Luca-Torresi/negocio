package com.example.negocio.controller;

import com.example.negocio.dto.gasto.GastoDTO;
import com.example.negocio.dto.gasto.GastoListaDTO;
import com.example.negocio.entity.Gasto;
import com.example.negocio.enums.TipoGasto;
import com.example.negocio.service.GastoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/gasto")
public class GastoController {
    private final GastoService gastoService;

    @PostMapping("/nuevo")
    public ResponseEntity<Gasto> nuevoGasto(
            @RequestHeader("X-Usuario-ID") Long idUsuario,
            @Valid @RequestBody GastoDTO dto) {
        return ResponseEntity.ok(gastoService.nuevoGasto(idUsuario, dto));
    }

    @PutMapping("/modificar/{idGasto}")
    public ResponseEntity<Gasto> modificarGasto(
            @PathVariable Long idGasto,
            @Valid @RequestBody GastoDTO dto) {
        return ResponseEntity.ok(gastoService.modificarGasto(idGasto,dto));
    }

    @GetMapping("/lista")
    public ResponseEntity<Page<GastoListaDTO>> listarGastos(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) TipoGasto tipoGasto,
            @RequestParam(required = false) LocalDate fechaInicio,
            @RequestParam(required = false) LocalDate fechaFin,
            @RequestParam(required = false) Long idUsuario){
        return ResponseEntity.ok(gastoService.listarGastos(page, size, tipoGasto, fechaInicio, fechaFin, idUsuario));
    }

    @GetMapping("/tipos")
    public ResponseEntity<List<String>> listarTipoGastos(){
        return  ResponseEntity.ok(gastoService.listarTipoGastos());
    }

}
