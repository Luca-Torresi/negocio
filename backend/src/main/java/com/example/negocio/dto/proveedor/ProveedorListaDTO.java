package com.example.negocio.dto.proveedor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProveedorListaDTO {
    private Long idProveedor;
    private String nombre;
}
