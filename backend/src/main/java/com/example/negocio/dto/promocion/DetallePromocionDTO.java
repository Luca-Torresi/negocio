package com.example.negocio.dto.promocion;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DetallePromocionDTO {
    @NotNull
    private Long idProducto;
    @NotNull @Positive
    private Integer cantidad;
}
