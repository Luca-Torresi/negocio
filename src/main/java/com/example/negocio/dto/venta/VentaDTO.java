package com.example.negocio.dto.venta;

import com.example.negocio.enums.MetodoDePago;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class VentaDTO {
    private Double total;
    private MetodoDePago metodoDePago;
    private List<DetalleVentaDTO> detalles;
}
