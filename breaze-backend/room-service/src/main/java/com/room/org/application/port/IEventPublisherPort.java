package com.room.org.application.port;

public interface IEventPublisherPort {
    void notificarEvento(String tipo, String descripcion);
}