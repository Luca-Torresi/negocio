package com.example.negocio.exception;

public class PromocionNoEncontradaException extends RuntimeException {
  public PromocionNoEncontradaException() {
    super("Promoción no encontrada");
  }
}
