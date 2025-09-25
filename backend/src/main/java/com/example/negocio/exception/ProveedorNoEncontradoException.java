package com.example.negocio.exception;

public class ProveedorNoEncontradoException extends RuntimeException {
    public ProveedorNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
