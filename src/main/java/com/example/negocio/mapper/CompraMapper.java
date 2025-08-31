package com.example.negocio.mapper;

import com.example.negocio.dto.compra.CompraDTO;
import com.example.negocio.dto.compra.CompraFullDTO;
import com.example.negocio.entity.Compra;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {DetalleCompraMapper.class})
public interface CompraMapper {

    Compra toEntity(CompraDTO dto);

    @Mapping(source = "proveedor.nombre", target = "proveedor")
    @Mapping(source = "usuario.nombre", target = "usuario")
    CompraFullDTO toFullDto(Compra entity);

    void updateFromDto(CompraDTO dto, @MappingTarget Compra entity);
}