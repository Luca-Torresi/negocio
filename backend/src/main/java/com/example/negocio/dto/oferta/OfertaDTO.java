package com.example.negocio.dto.oferta;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class OfertaDTO {
    private Integer cantidadMinima;
    private BigDecimal nuevoPrecio;
}
