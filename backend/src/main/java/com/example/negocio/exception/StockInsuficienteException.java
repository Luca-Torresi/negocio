package com.example.negocio.exception;

public class StockInsuficienteException extends RuntimeException {
    public StockInsuficienteException(String producto) {
        super("No hay stock suficiente del producto: " + producto);
    }
}
