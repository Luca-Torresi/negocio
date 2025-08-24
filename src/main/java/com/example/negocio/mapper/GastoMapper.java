package com.example.negocio.mapper;

import com.example.negocio.dto.gasto.GastoDTO;
import com.example.negocio.dto.gasto.GastoListaDTO;
import com.example.negocio.entity.Gasto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface GastoMapper {

    Gasto toEntity(GastoDTO dto);

    void updateFromDto(GastoDTO dto, @MappingTarget Gasto entity);

    @Mapping(source = "usuario.nombre", target = "usuario")
    GastoListaDTO toDto(Gasto gasto);
}
