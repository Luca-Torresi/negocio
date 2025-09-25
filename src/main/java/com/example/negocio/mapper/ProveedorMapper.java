package com.example.negocio.mapper;

import com.example.negocio.dto.proveedor.ProveedorAbmDTO;
import com.example.negocio.dto.proveedor.ProveedorDTO;
import com.example.negocio.dto.proveedor.ProveedorListaDTO;
import com.example.negocio.entity.Proveedor;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProveedorMapper {
    Proveedor toEntity(ProveedorDTO dto);
    ProveedorAbmDTO toAbmDto(Proveedor entity);
    ProveedorListaDTO toListaDTO(Proveedor entity);

    void updateFromDto(ProveedorDTO dto, @MappingTarget Proveedor entity);
}
