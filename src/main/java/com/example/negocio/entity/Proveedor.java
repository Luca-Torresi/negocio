package com.example.negocio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class Proveedor {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProveedor;
    private String nombre;
    private String telefono;
    private String email;
    private Boolean estado;
}
