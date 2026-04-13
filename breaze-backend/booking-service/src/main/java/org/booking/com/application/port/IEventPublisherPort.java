package org.booking.com.application.port;

public interface IEventPublisherPort {

    void notificarEvento(String tipo, String descripcion);

}
