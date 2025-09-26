package com.example.negocio.dto.proveedor;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProveedorDTO {
    @NotNull
    private String nombre;
    private String telefono;
    private String email;
}
