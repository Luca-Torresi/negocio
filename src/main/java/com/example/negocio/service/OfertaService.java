package com.example.negocio.service;

import com.example.negocio.dto.oferta.OfertaDTO;
import com.example.negocio.entity.Oferta;
import com.example.negocio.entity.Producto;
import com.example.negocio.exception.OfertaNoEncontradaException;
import com.example.negocio.exception.ProductoNoEncontradoException;
import com.example.negocio.mapper.OfertaMapper;
import com.example.negocio.repository.OfertaRepository;
import com.example.negocio.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OfertaService {
    private final OfertaRepository ofertaRepository;
    private final OfertaMapper ofertaMapper;
    private final ProductoRepository productoRepository;

    public Oferta nuevaOferta(OfertaDTO dto) {
        Oferta oferta = ofertaMapper.toEntity(dto);

        Producto producto = productoRepository.findById(dto.getIdProducto()).orElseThrow(() -> new ProductoNoEncontradoException());
        oferta.setProducto(producto);

        return ofertaRepository.save(oferta);
    }

    public Oferta modificarOferta(Long idOferta, OfertaDTO dto) {
        Oferta oferta = ofertaRepository.findById(idOferta).orElseThrow(() -> new OfertaNoEncontradaException());

        ofertaMapper.updateFromDto(dto, oferta);
        return ofertaRepository.save(oferta);
    }

    public void eliminarOferta(Long idOferta) {
        Oferta oferta = ofertaRepository.findById(idOferta).orElseThrow(() -> new OfertaNoEncontradaException());

        Producto producto = oferta.getProducto();
        producto.setOferta(null);

        ofertaRepository.deleteById(idOferta);
    }

}
