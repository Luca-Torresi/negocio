package com.example.negocio.dto.estadisticas;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class GananciasVsGastosDTO {
    private String mes;
    private BigDecimal ganancias;
    private BigDecimal gastos;
}
