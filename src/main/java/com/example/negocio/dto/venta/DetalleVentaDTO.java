package com.example.negocio.dto.venta;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DetalleVentaDTO {
    private Long idProducto;
    private Long idPromocion;
    private Integer cantidad;
}
