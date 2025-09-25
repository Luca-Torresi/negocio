package com.example.negocio.dto.estadistica;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class KpiDTO {
    private String titulo;
    private Object valor;
}
