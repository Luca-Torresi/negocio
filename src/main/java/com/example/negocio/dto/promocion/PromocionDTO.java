package com.example.negocio.dto.promocion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class PromocionDTO {
    private String nombre;
    private String descripcion;
    private Double precio;
    private List<DetallePromocionDTO> detalles;
}
