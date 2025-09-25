package com.example.negocio.entity;

import com.example.negocio.enums.TipoGasto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
@Entity @Table
public class Gasto {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGasto;
    private String descripcion;
    private BigDecimal monto;
    private LocalDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    private TipoGasto tipoGasto;

    @ManyToOne @JoinColumn(name = "idUsuario")
    private Usuario usuario;

}
