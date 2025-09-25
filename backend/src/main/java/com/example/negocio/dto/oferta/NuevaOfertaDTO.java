package com.example.negocio.dto.oferta;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class NuevaOfertaDTO {
    @NotNull
    private Long idProducto;
    @NotNull @Positive
    private Integer cantidadMinima;
    @NotNull @Positive
    private BigDecimal nuevoPrecio;
}
