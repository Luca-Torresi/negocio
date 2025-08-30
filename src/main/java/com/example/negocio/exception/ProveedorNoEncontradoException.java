package com.example.negocio.exception;

public class ProveedorNoEncontradoException extends RuntimeException {
    public ProveedorNoEncontradoException() {
        super("Proveedor no encontrado");
    }
}
