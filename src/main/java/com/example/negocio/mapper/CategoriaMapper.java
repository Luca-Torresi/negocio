package com.example.negocio.mapper;

import com.example.negocio.dto.categoria.CategoriaAbmDTO;
import com.example.negocio.dto.categoria.CategoriaDTO;
import com.example.negocio.entity.Categoria;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {ProductoMapper.class})
public interface CategoriaMapper {
    Categoria toEntity(CategoriaDTO dto);

    @Mapping(source = "categoriaPadre.idCategoria", target = "idCategoriaPadre")
    CategoriaAbmDTO toAbmDTO(Categoria categoria);

    void updateFromDto(CategoriaDTO dto,@MappingTarget Categoria entity);
}
