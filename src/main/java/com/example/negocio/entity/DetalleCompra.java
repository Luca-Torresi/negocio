package com.example.negocio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class DetalleCompra {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetalleCompra;
    private Integer cantidad;
    private BigDecimal costoUnitario;

    @ManyToOne @JoinColumn(name = "idProducto")
    private Producto producto;

    @ManyToOne @JoinColumn(name = "idCompra")
    private Compra compra;

}
