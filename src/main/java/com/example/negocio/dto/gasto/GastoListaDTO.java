package com.example.negocio.dto.gasto;

import com.example.negocio.enums.TipoGasto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class GastoListaDTO {
    private Integer idGasto;
    private TipoGasto tipoGasto;
    private String descripcion;
    private BigDecimal monto;
    private LocalDateTime fechaHora;
    private String usuario;
}
