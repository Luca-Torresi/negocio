package com.example.negocio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class Producto {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;
    private String nombre;
    private BigDecimal precio;
    private BigDecimal costo;
    private Integer stock;
    private Integer stockMinimo;
    private Boolean estado;
    private String codigoDeBarras;

    @ManyToOne @JoinColumn(name = "idMarca")
    private Marca marca;

    @ManyToOne @JoinColumn(name = "idCategoria")
    private Categoria categoria;

    @ManyToOne @JoinColumn(name = "idProveedor")
    private Proveedor proveedor;

    @OneToOne(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private Descuento descuento;

    @OneToOne(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private Oferta oferta;
}
