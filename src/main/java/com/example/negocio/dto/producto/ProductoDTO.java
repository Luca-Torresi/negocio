package com.example.negocio.dto.producto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProductoDTO {
    private String nombre;
    private Double precio;
    private Double costo;
    private Integer stock;
    private Integer stockMinimo;
    private Long idMarca;
    private Long idCategoria;
    private Long idProveedor;
}
