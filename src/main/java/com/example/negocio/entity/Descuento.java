package com.example.negocio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class Descuento {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDescuento;
    private Integer porcentaje;

    @OneToOne @JsonIgnore @JoinColumn(name = "idProducto")
    private Producto producto;

}
