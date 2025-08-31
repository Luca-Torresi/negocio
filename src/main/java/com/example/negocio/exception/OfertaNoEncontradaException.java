package com.example.negocio.exception;

public class OfertaNoEncontradaException extends RuntimeException {
    public OfertaNoEncontradaException() {
        super("Oferta no encontrada");
    }
}
