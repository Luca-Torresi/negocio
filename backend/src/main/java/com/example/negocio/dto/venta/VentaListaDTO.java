package com.example.negocio.dto.venta;

import com.example.negocio.enums.MetodoDePago;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class VentaListaDTO {
    private Long idVenta;
    private BigDecimal total;
    private BigDecimal descuento;
    private LocalDateTime fechaHora;
    private MetodoDePago metodoDePago;
    private List<DetalleVentaListaDTO> detalles;
    private String usuario;
}
