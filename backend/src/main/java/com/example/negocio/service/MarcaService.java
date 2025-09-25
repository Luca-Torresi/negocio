package com.example.negocio.service;

import com.example.negocio.dto.marca.MarcaDTO;
import com.example.negocio.dto.marca.MarcaListaDTO;
import com.example.negocio.entity.Marca;
import com.example.negocio.exception.MarcaNoEncontradaException;
import com.example.negocio.mapper.MarcaMapper;
import com.example.negocio.repository.MarcaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarcaService {
    private final MarcaRepository marcaRepository;
    private final MarcaMapper marcaMapper;

    public Marca nuevaMarca(MarcaDTO dto){
        Marca marca = marcaMapper.toEntity(dto);
        return marcaRepository.save(marca);
    }

    public Marca modificarMarca(Long idMarca, MarcaDTO dto){
        Marca marca = marcaRepository.findById(idMarca).orElseThrow(() -> new MarcaNoEncontradaException());

        marcaMapper.updateFromDto(dto, marca);
        return marcaRepository.save(marca);
    }

    public List<MarcaListaDTO> listarMarcas(){
        List<Marca> marcas = marcaRepository.findAll();

        return marcas.stream()
                .map(marcaMapper::toListaDto)
                .collect(Collectors.toList());
    }

}
