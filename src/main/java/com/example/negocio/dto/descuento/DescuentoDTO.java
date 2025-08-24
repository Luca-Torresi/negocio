package com.example.negocio.dto.descuento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DescuentoDTO {
    private Long idProducto;
    private Integer porcentaje;
}
