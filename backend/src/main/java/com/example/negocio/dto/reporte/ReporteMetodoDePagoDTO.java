package com.example.negocio.dto.reporte;

import com.example.negocio.enums.MetodoDePago;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ReporteMetodoDePagoDTO {
    private MetodoDePago metodoDePago;
    private BigDecimal total;
}
