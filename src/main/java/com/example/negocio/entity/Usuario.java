package com.example.negocio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class Usuario {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    private String nombre;

}
