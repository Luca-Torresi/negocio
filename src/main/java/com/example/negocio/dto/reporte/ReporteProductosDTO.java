package com.example.negocio.dto.reporte;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ReporteProductosDTO {
    private String producto;
    private Integer stock;
    private BigDecimal precio;
    private BigDecimal costo;
}
