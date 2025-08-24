package com.example.negocio.dto.compra;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DetalleCompraDTO {
    private Long idProducto;
    private Integer cantidad;
}
