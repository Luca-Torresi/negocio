package com.example.negocio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class Compra {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCompra;
    private BigDecimal total;
    private LocalDateTime fechaHora;

    @ManyToOne @JoinColumn(name = "idProveedor")
    private Proveedor proveedor;

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleCompra> detalles;

    @ManyToOne @JoinColumn(name = "idUsuario")
    private Usuario usuario;
}
