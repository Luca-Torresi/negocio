package com.example.negocio.dto.venta;

import com.example.negocio.enums.MetodoDePago;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class VentaDTO {
    @NotNull
    private MetodoDePago metodoDePago;
    @Valid @NotEmpty
    private List<DetalleVentaDTO> detalles;
}
