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
        // En el futuro, aquí se implementará la llamada HTTP a la Lambda de AWS.
        // Por ahora, registramos la intención en los logs para validación de arquitectura.
        log.info("[AUDITORIA - ASINCRONA] Tipo: {} | Detalle: {}", tipo, descripcion);

        // Simulación: RestTemplate.postForEntity(lambdaUrl, ...)
    }
}