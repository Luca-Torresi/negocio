package com.example.negocio.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class DetallePromocion {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetallePromocion;
    private Integer cantidad;

    @ManyToOne @JoinColumn(name = "idProducto")
    private Producto producto;

    @ManyToOne @JoinColumn(name = "idPromocion")
    @JsonBackReference
    private Promocion promocion;

}
