package com.example.negocio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class DetalleCompra {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetalleCompra;
    private Integer cantidad;
    private Double precioUnitario;

    @ManyToOne @JoinColumn(name = "idProducto")
    private Producto producto;

    @ManyToOne @JoinColumn(name = "compra")
    private Compra compra;

}
