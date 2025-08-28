package com.example.negocio.dto.categoria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class CategoriaListaDTO {
    private Long idCategoria;
    private String nombre;
    private Long idCategoriaPadre;
}
