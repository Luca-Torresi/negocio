package com.example.negocio.dto.descuento;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DescuentoDTO {
    @NotNull
    private Long idProducto;
    @NotNull @Positive
    private Integer porcentaje;
}
