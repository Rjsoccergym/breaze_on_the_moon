package service;

public interface IEventPublisher {

    void notificarEvento(String tipo, String descripcion);

}
