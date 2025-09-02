package com.example.negocio.dto.gasto;

import com.example.negocio.enums.TipoGasto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class GastoDTO {
    @NotNull
    private TipoGasto tipoGasto;
    private String descripcion;
    @NotNull @Positive
    private BigDecimal monto;
}
