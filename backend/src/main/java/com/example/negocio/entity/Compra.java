package com.example.negocio.entity;

import com.example.negocio.enums.EstadoCompra;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @Enumerated(EnumType.STRING)
    private EstadoCompra estadoCompra;

    @ManyToOne @JoinColumn(name = "idProveedor")
    private Proveedor proveedor;

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<DetalleCompra> detalles;

    @ManyToOne @JoinColumn(name = "idUsuario")
    private Usuario usuario;
}
