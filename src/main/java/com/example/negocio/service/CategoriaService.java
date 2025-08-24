package com.example.negocio.service;

import com.example.negocio.dto.categoria.CategoriaAbmDTO;
import com.example.negocio.dto.categoria.CategoriaDTO;
import com.example.negocio.dto.categoria.CategoriaListaDTO;
import com.example.negocio.entity.Categoria;
import com.example.negocio.mapper.CategoriaMapper;
import com.example.negocio.mapper.CategoriaMapperImpl;
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
        Categoria categoria = categoriaMapper.toEntity(dto, categoriaRepository);
        categoria.setEstado(true);

        return categoriaRepository.save(categoria);
    }

    public Categoria modificarCategoria(Long idCategoria, CategoriaDTO dto) {
        Categoria categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RuntimeException());

        categoriaMapper.updateFromDto(dto, categoria, categoriaRepository);
        return categoriaRepository.save(categoria);
    }

    public List<CategoriaAbmDTO> obtenerCategorias(){
        List<Categoria> categorias = categoriaRepository.findAll();

        return categorias.stream()
                .map(categoriaMapper::toAbmDTO)
                .collect(Collectors.toList());
    }

    public List<CategoriaListaDTO> listarCategorias(){
        List<Categoria> categorias = categoriaRepository.findAll();

        return categorias.stream()
                .map(categoriaMapper::toListaDTO)
                .collect(Collectors.toList());
    }

    public void cambiarEstadoCategoria(Long idCategoria) {
        Categoria categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        categoria.setEstado(!categoria.getEstado());
        categoriaRepository.save(categoria);
    }
}
