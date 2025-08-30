package com.example.negocio.dto.compra;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DetalleCompraFullDTO {
    private String producto;
    private Integer cantidad;
    private Double costoUnitario;
}
