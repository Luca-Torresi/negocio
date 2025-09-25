package com.example.negocio.mapper;

import com.example.negocio.dto.marca.MarcaDTO;
import com.example.negocio.dto.marca.MarcaListaDTO;
import com.example.negocio.entity.Marca;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MarcaMapper {
    Marca toEntity(MarcaDTO marcaDTO);
    MarcaListaDTO toListaDto(Marca marca);

    void updateFromDto(MarcaDTO dto, @MappingTarget Marca entity);
}
