package com.auth.org.infrastructure.adapter;

import com.auth.org.application.port.IEventPublisherPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventPublisherAdapter implements IEventPublisherPort {

    private final RestTemplate restTemplate;

    @Value("${app.auditoria-url:http://api-gateway/auditoria}")
    private String lambdaUrl;

    @Async
    @Override
    public void notificarEvento(String tipo, String descripcion) {
        try {
            Map<String, String> payload = Map.of("tipo", tipo, "descripcion", descripcion);
            restTemplate.postForEntity(lambdaUrl, payload, String.class);
            log.info("[AUDITORIA] Evento {} enviado exitosamente", tipo);
        } catch (Exception e) {
            log.error("[AUDITORIA] Error al notificar evento: {}", e.getMessage());
        }
    }
}