package com.example.negocio.dto.producto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProductoDTO {
    @NotBlank
    private String nombre;
    @NotNull @Positive
    private BigDecimal precio;
    @NotNull @Positive
    private BigDecimal costo;
    @NotNull @PositiveOrZero
    private Integer stock;
    private Integer stockMinimo;
    private String codigoDeBarras;
    @NotNull
    private Long idMarca;
    @NotNull
    private Long idCategoria;
    @NotNull
    private Long idProveedor;
}
