package com.example.negocio.dto.descuento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DescuentoAbmDTO {
    private Long idDescuento;
    private String producto;
    private Integer porcentaje;
    private Double precio;
}
