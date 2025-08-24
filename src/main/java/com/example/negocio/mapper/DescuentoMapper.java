package com.example.negocio.mapper;

import com.example.negocio.dto.descuento.DescuentoAbmDTO;
import com.example.negocio.dto.descuento.DescuentoDTO;
import com.example.negocio.entity.Descuento;
import com.example.negocio.entity.Producto;
import com.example.negocio.repository.ProductoRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DescuentoMapper {

    @Mapping(source = "idProducto", target = "producto")
    Descuento toEntity(DescuentoDTO dto, @Context ProductoRepository productoRepository);

    @Mapping(source = "producto.nombre", target = "producto")
    @Mapping(source = "producto.precio", target = "precio")
    DescuentoAbmDTO toAbmDto(Descuento descuento);

    @Mapping(source = "idProducto", target = "producto")
    void updateFromDto(DescuentoDTO dto, @MappingTarget Descuento entity, @Context ProductoRepository productoRepository);

    default Producto mapProducto(Long idProducto, @Context ProductoRepository productoRepository) {
        return productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
}
