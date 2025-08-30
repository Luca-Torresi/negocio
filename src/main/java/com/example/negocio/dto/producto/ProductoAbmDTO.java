package com.example.negocio.dto.producto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProductoAbmDTO {
    private Long idProducto;
    private String nombre;
    private Double precio;
    private Double porcentaje;
    private Double precioConDescuento;
    private Double costo;
    private Integer stock;
    private Integer stockSuma;
    private Integer stockMinimo;
    private Boolean estado;
    private String color;
    private String marca;
    private String categoria;
    private String proveedor;
}
