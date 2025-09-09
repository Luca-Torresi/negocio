package com.example.negocio.service;

import com.example.negocio.dto.usuario.UsuarioDTO;
import com.example.negocio.entity.Usuario;
import com.example.negocio.mapper.UsuarioMapper;
import com.example.negocio.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    public List<UsuarioDTO> listaUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();

        return usuarios.stream()
                .map(usuarioMapper::toDto)
                .collect(Collectors.toList());
    }
}
