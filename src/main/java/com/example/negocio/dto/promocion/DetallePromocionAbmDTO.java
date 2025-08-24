package com.example.negocio.dto.promocion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DetallePromocionAbmDTO {
    private String producto;
    private Integer cantidad;
}
