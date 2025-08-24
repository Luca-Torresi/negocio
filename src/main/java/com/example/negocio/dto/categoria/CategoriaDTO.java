package com.example.negocio.dto.categoria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class CategoriaDTO {
    private String nombre;
    private String color;
    private Long idCategoriaPadre;
}
