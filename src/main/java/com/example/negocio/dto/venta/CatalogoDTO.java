package com.example.negocio.dto.venta;

import com.example.negocio.dto.oferta.OfertaDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class CatalogoDTO {
    private String tipo;
    private Long id;
    private String nombre;
    private BigDecimal precioFinal;
    private OfertaDTO oferta;
}
