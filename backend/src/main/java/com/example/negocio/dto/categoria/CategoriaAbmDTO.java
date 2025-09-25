package com.example.negocio.dto.categoria;

import com.example.negocio.dto.producto.ProductoVentaDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class CategoriaAbmDTO {
    private Long idCategoria;
    private String nombre;
    private String descripcion;
    private Boolean estado;
    private Long idCategoriaPadre;
    private List<ProductoVentaDTO> productos;
}
