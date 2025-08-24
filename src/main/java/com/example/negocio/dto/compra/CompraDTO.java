package com.example.negocio.dto.compra;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class CompraDTO {
    private Long idProveedor;
    private Double total;
    private List<DetalleCompraDTO> detalles;
}
