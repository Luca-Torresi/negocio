package com.example.negocio.dto.marca;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class MarcaAbmDTO {
    private Long idMarca;
    private String nombre;
    private Boolean estado;
}
