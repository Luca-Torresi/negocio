package com.example.negocio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class Categoria {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCategoria;
    private String nombre;
    private String color;
    private Boolean estado;

    @ManyToOne @JoinColumn(name = "idCategoriaPadre")
    private Categoria categoriaPadre;

    @JsonIgnore @OneToMany(mappedBy = "categoria")
    private List<Producto> productos;
}
