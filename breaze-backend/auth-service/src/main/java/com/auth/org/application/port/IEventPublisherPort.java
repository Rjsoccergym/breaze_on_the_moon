package com.auth.org.application.port;

public interface IEventPublisherPort {
    void notificarEvento(String tipo, String descripcion);
}