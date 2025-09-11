package com.example.negocio.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class DetalleVenta {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetalleVenta;
    private Integer cantidad;
    private BigDecimal precioUnitario;

    @ManyToOne @JoinColumn(name = "idProducto")
    private Producto producto;

    @ManyToOne @JoinColumn(name = "idPromocion")
    private Promocion promocion;

    @ManyToOne @JoinColumn(name = "idVenta")
    @JsonBackReference
    private Venta venta;

}

