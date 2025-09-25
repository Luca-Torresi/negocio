package com.example.negocio.dto.promocion;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class PromocionDTO {
    @NotBlank
    private String nombre;
    private String descripcion;
    @NotNull @Positive
    private BigDecimal precio;
    @Valid @NotEmpty
    private List<DetallePromocionDTO> detalles;
}
