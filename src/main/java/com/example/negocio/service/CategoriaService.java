package com.example.negocio.service;

import com.example.negocio.dto.categoria.CategoriaAbmDTO;
import com.example.negocio.dto.categoria.CategoriaDTO;
import com.example.negocio.entity.Categoria;
import com.example.negocio.exception.CategoriaNoEncontradaException;
import com.example.negocio.mapper.CategoriaMapper;
import com.example.negocio.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    public Categoria nuevaCategoria(CategoriaDTO dto) {

        Categoria categoria = categoriaMapper.toEntity(dto);
        categoria.setEstado(true);

        if(dto.getIdCategoriaPadre() != null){
            Categoria categoriaPadre = categoriaRepository.findById(dto.getIdCategoriaPadre()).orElseThrow(() -> new CategoriaNoEncontradaException());
            categoria.setCategoriaPadre(categoriaPadre);
        }

        return categoriaRepository.save(categoria);
    }

    public Categoria modificarCategoria(Long idCategoria, CategoriaDTO dto) {
        Categoria categoria = categoriaRepository.findById(idCategoria).orElseThrow(() -> new CategoriaNoEncontradaException());

        categoriaMapper.updateFromDto(dto, categoria);

        if(dto.getIdCategoriaPadre() != null){
            Categoria categoriaPadre = categoriaRepository.findById(dto.getIdCategoriaPadre()).orElseThrow(() -> new CategoriaNoEncontradaException());
            categoria.setCategoriaPadre(categoriaPadre);
        }

        return categoriaRepository.save(categoria);
    }

    public List<CategoriaAbmDTO> obtenerCategorias(){
        List<Categoria> categorias = categoriaRepository.findAll();

        return categorias.stream()
                .map(categoriaMapper::toAbmDTO)
                .collect(Collectors.toList());
    }

    public void cambiarEstadoCategoria(Long idCategoria) {
        Categoria categoria = categoriaRepository.findById(idCategoria).orElseThrow(() -> new CategoriaNoEncontradaException());

        categoria.setEstado(!categoria.getEstado());
        categoriaRepository.save(categoria);
    }
}
