package com.example.negocio.dto.venta;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DetalleVentaListaDTO {
    private String nombre;
    private Integer cantidad;
    private BigDecimal precioUnitario;
}
