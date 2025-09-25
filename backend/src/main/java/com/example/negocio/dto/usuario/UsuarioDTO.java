package com.example.negocio.dto.usuario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class UsuarioDTO {
    private Long idUsuario;
    private String nombre;
}
