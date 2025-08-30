package com.example.negocio.mapper;

import com.example.negocio.dto.venta.VentaDTO;
import com.example.negocio.dto.venta.VentaListaDTO;
import com.example.negocio.entity.Venta;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {DetalleVentaMapper.class})
public interface VentaMapper {

    //@Mapping(source = "detalles", target = "detalles")
    Venta toEntity(VentaDTO dto);

    @Mapping(source = "usuario.nombre", target = "usuario")
    VentaListaDTO toDto(Venta entity);

}
