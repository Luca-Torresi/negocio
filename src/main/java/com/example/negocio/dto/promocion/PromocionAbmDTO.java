package com.example.negocio.dto.promocion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class PromocionAbmDTO {
    private Long idPromocion;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Boolean estado;
    private List<DetallePromocionAbmDTO> detalles;
}
