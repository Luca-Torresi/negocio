package com.example.negocio.exception;

public class CategoriaNoEncontradaException extends RuntimeException {
    public CategoriaNoEncontradaException() {
        super("No se encontró la categoría");
    }
}
