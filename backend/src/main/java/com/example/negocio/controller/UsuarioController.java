package com.example.negocio.controller;

import com.example.negocio.dto.usuario.NuevoUsuarioDTO;
import com.example.negocio.dto.usuario.UsuarioDTO;
import com.example.negocio.entity.Usuario;
import com.example.negocio.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/usuario")
public class UsuarioController {
    private final UsuarioService usuarioService;

    @PostMapping("/nuevo")
    public ResponseEntity<Usuario> nuevoUsuario(@Valid @RequestBody NuevoUsuarioDTO dto) {
        return ResponseEntity.ok(usuarioService.nuevoUsuario(dto));
    }

    @GetMapping("/lista")
    public ResponseEntity<List<UsuarioDTO>> listaUsuarios() {
        return ResponseEntity.ok(usuarioService.listaUsuarios());
    }

}
