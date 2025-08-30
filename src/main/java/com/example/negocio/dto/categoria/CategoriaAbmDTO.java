package com.example.negocio.dto.categoria;

import com.example.negocio.dto.producto.ProductoItemDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class CategoriaAbmDTO {
    private Long idCategoria;
    private String nombre;
    private String color;
    private Boolean estado;
    private Long idCategoriaPadre;
    private List<ProductoItemDTO> productos;
}
