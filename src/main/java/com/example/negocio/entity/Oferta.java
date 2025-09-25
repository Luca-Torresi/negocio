package com.example.negocio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class Oferta {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOferta;
    private Integer cantidadMinima;
    private BigDecimal nuevoPrecio;

    @OneToOne @JsonIgnore @JoinColumn(name = "idProducto")
    private Producto producto;
}
