package com.example.negocio.dto.estadistica;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class VentasPorHoraDTO {
    private Integer hora;
    private Long cantidad;
}
