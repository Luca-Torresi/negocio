package com.example.negocio.dto.producto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProductoAbmDTO {
    private Long idProducto;
    private String nombre;
    private BigDecimal precio;
    private Integer porcentaje;
    private BigDecimal precioConDescuento;
    private BigDecimal costo;
    private Integer cantidadMinima;
    private BigDecimal nuevoPrecio;
    private Integer stock;
    private Integer stockSuma;
    private Integer stockMinimo;
    private Boolean estado;
    private String marca;
    private String categoria;
    private String proveedor;
    private Long idCategoria;
    private Long idDescuento;
    private Long idOferta;
}
