package com.example.negocio.dto.producto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProductoVentaDTO {
    private Long idProducto;
    private String nombre;
    private Double precioFinal;
    private String color;
}

