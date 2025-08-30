package com.example.negocio.service;

import com.example.negocio.dto.descuento.DescuentoDTO;
import com.example.negocio.entity.Descuento;
import com.example.negocio.entity.Producto;
import com.example.negocio.mapper.DescuentoMapper;
import com.example.negocio.repository.DescuentoRepository;
import com.example.negocio.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DescuentoService {
    private final DescuentoRepository descuentoRepository;
    private final ProductoRepository productoRepository;
    private final DescuentoMapper descuentoMapper;

    public Descuento nuevoDescuento(DescuentoDTO dto) {
        Producto producto = productoRepository.findById(dto.getIdProducto())
                .orElseThrow(() -> new RuntimeException("No existe el producto"));

        Descuento descuento = descuentoMapper.toEntity(dto);
        descuento.setProducto(producto);

        return descuentoRepository.save(descuento);
    }

    public Descuento modificarDescuento(Long idDescuento, DescuentoDTO dto) {
        Descuento descuento = descuentoRepository.findById(idDescuento)
                .orElseThrow(() -> new RuntimeException("Descuento no encontrado"));

        descuentoMapper.updateFromDto(dto, descuento);
        return descuentoRepository.save(descuento);
    }

    public void eliminarDescuento(Long idDescuento) {
        Descuento descuento = descuentoRepository.findById(idDescuento)
                .orElseThrow(() -> new RuntimeException("Descuento no encontrado"));

        Producto producto = descuento.getProducto();
        producto.setDescuento(null);

        descuentoRepository.deleteById(idDescuento);
    }
}
