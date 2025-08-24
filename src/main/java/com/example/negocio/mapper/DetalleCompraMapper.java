package com.example.negocio.mapper;

import com.example.negocio.dto.compra.DetalleCompraDTO;
import com.example.negocio.dto.compra.DetalleCompraFullDTO;
import com.example.negocio.entity.DetalleCompra;
import com.example.negocio.entity.Producto;
import com.example.negocio.repository.ProductoRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DetalleCompraMapper {

    @Mapping(source = "idProducto", target = "producto")
    DetalleCompra toEntity(DetalleCompraDTO dto, @Context ProductoRepository productoRepository);

    @Mapping(source = "producto.nombre", target = "producto")
    DetalleCompraFullDTO toFullDto(DetalleCompra entity);

    default Producto mapProducto(Long idProducto, @Context ProductoRepository productoRepository) {
        return productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

}
