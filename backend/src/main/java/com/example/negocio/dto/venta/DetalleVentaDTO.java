package com.example.negocio.dto.venta;

import com.example.negocio.validation.ExactlyOneNotNull;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@ExactlyOneNotNull
public class DetalleVentaDTO {
    private Long idProducto;
    private Long idPromocion;
    @NotNull @Positive
    private Integer cantidad;
}
