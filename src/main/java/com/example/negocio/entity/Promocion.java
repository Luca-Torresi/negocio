package com.example.negocio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class Promocion {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPromocion;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Boolean estado;

    @OneToMany(mappedBy = "promocion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePromocion> detalles;

}
