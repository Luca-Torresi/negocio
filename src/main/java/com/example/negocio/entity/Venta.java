package com.example.negocio.entity;

import com.example.negocio.enums.MetodoDePago;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class Venta {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVenta;
    private Double total;
    private LocalDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    private MetodoDePago metodoDePago;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL)
    private List<DetalleVenta> detalles;

    @ManyToOne @JoinColumn(name = "idUsuario")
    private Usuario usuario;

}
