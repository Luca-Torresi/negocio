package com.example.negocio.dto.producto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProductoDTO {
    private String nombre;
    private BigDecimal precio;
    private BigDecimal costo;
    private Integer stock;
    private Integer stockMinimo;
    private Long idMarca;
    private Long idCategoria;
    private Long idProveedor;
}
