package service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EventPublisher implements IEventPublisher {

    @Async
    @Override
    public void notificarEvento(String tipo, String descripcion) {
        // Requerimiento: Notificar a Lambda vía HTTP sin esperar respuesta
        log.info("[AUDITORIA - ASINCRONA] Tipo: {} | Detalle: {}", tipo, descripcion);
        // Aquí irá la implementación de RestTemplate/WebClient hacia AWS Lambda
    }
}