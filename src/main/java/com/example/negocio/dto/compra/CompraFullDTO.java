package com.example.negocio.dto.compra;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class CompraFullDTO {
    private Long idCompra;
    private Double total;
    private LocalDateTime fechaHora;
    private String proveedor;
    private String usuario;
    private List<DetalleCompraFullDTO> detalles;
}
