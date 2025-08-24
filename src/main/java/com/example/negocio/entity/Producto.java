package com.example.negocio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class Producto {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;
    private String nombre;
    private Double precio;
    private Double costo;
    private Integer stock;
    private Integer stockMinimo;
    private Boolean estado;

    @ManyToOne @JoinColumn(name = "idMarca")
    private Marca marca;

    @ManyToOne @JoinColumn(name = "idCategoria")
    private Categoria categoria;

    @ManyToOne @JoinColumn(name = "idProveedor")
    private Proveedor proveedor;

    @OneToOne(mappedBy = "producto")
    private Descuento descuento;
}
