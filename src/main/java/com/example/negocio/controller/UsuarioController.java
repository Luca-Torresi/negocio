package com.example.negocio.controller;

import com.example.negocio.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/usuario")
public class UsuarioController {
    private final UsuarioService usuarioService;

}
