package com.example.negocio.mapper;

import com.example.negocio.dto.usuario.UsuarioDTO;
import com.example.negocio.entity.Usuario;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    UsuarioDTO toDto(Usuario usuario);
}
