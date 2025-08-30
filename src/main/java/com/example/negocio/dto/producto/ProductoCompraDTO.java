package com.example.negocio.dto.producto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProductoCompraDTO {
    private Long idProducto;
    private String nombre;
    private Double costo;
}
