package com.example.negocio.mapper;

import com.example.negocio.dto.categoria.CategoriaAbmDTO;
import com.example.negocio.dto.categoria.CategoriaDTO;
import com.example.negocio.dto.categoria.CategoriaListaDTO;
import com.example.negocio.entity.Categoria;
import com.example.negocio.repository.CategoriaRepository;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {ProductoMapper.class})
public interface CategoriaMapper {

    Categoria toEntity(CategoriaDTO dto);

    void updateFromDto(
            CategoriaDTO dto,
            @MappingTarget Categoria entity
    );

    @Mapping(source = "categoriaPadre.idCategoria", target = "idCategoriaPadre")
    CategoriaAbmDTO toAbmDTO(Categoria categoria);

    @Mapping(source = "categoriaPadre.idCategoria", target = "idCategoriaPadre")
    CategoriaListaDTO toListaDTO(Categoria categoria);

}
