package com.example.negocio.mapper;

import com.example.negocio.dto.categoria.CategoriaAbmDTO;
import com.example.negocio.dto.categoria.CategoriaDTO;
import com.example.negocio.dto.categoria.CategoriaListaDTO;
import com.example.negocio.entity.Categoria;
import com.example.negocio.repository.CategoriaRepository;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {ProductoMapper.class})
public interface CategoriaMapper {

    @Mapping(source = "idCategoriaPadre", target = "categoriaPadre", qualifiedByName = "mapCategoria")
    Categoria toEntity(CategoriaDTO dto, @Context CategoriaRepository categoriaRepository);

    @Mapping(source = "idCategoriaPadre", target = "categoriaPadre", qualifiedByName = "mapCategoria")
    void updateFromDto(
            CategoriaDTO dto,
            @MappingTarget Categoria entity,
            @Context CategoriaRepository categoriaRepository
    );

    @Mapping(source = "categoriaPadre.idCategoria", target = "idCategoriaPadre")
    CategoriaAbmDTO toAbmDTO(Categoria categoria);

    CategoriaListaDTO toListaDTO(Categoria categoria);

    @Named("mapCategoria")
    default Categoria mapCategoria(Long idCategoria, @Context CategoriaRepository categoriaRepository) {
        if (idCategoria == null) return null;
        return categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

}
