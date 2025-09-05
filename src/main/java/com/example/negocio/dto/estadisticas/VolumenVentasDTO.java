package com.example.negocio.dto.estadisticas;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class VolumenVentasDTO {
    private String mes;
    private String nombre;
    private BigDecimal cantidad;
}
