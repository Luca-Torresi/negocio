package com.example.negocio.dto.compra;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class CompraDTO {
    @NotNull
    private Long idProveedor;
    private Integer descuento;
    @Valid @NotEmpty
    private List<DetalleCompraDTO> detalles;
}
