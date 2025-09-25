package com.example.negocio.exception;

public class MarcaNoEncontradaException extends RuntimeException {
    public MarcaNoEncontradaException() {
        super("Marca no encontrada");
    }
}
