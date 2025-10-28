package com.example.negocio.dto.compra;

import com.example.negocio.enums.EstadoCompra;
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
    @Valid @NotEmpty
    private List<DetalleCompraDTO> detalles;
}
