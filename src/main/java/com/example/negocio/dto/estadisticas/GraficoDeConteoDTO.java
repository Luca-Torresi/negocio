package com.example.negocio.dto.estadisticas;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class GraficoDeConteoDTO {
    private String etiqueta;
    private Long valor;
}
