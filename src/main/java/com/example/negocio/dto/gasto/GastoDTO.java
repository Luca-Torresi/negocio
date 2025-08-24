package com.example.negocio.dto.gasto;

import com.example.negocio.enums.TipoGasto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class GastoDTO {
    private TipoGasto tipoGasto;
    private String descripcion;
    private Double monto;
}
