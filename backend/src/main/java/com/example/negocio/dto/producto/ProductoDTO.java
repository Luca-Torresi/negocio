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
    @NotNull
    private BigDecimal precio;
    @NotNull
    private BigDecimal costo;
    @NotNull @PositiveOrZero
    private Integer stock;
    @NotNull @PositiveOrZero
    private Integer stockMinimo;
    private String codigoDeBarras;
    private Long idMarca;
    @NotNull
    private Long idCategoria;
    @NotNull
    private Long idProveedor;
}
