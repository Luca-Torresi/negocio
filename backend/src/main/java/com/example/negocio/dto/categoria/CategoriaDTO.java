package com.example.negocio.dto.categoria;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class CategoriaDTO {
    @NotBlank
    private String nombre;
    private String descripcion;
    private Long idCategoriaPadre;
}
