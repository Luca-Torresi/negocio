package com.example.negocio.exception;

public class DescuentoNoEncontradoException extends RuntimeException {
    public DescuentoNoEncontradoException() {
        super("Descuento no encontrado");
    }
}
