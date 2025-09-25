package com.example.negocio.dto.estadistica;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ResultadoMensualDTO {
    private String mes;
    private BigDecimal total;
}
