package com.auth.org.infrastructure.adapter;

import com.auth.org.application.port.IEventPublisherPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventPublisherAdapter implements IEventPublisherPort {

    private final RestTemplate restTemplate;

    @Value("${app.auditoria-url}")
    private String lambdaUrl;

    @Value("${spring.application.name:auth-service}")
    private String appName;

    @Async
    @Override
    public void notificarEvento(String tipo, String descripcion) {
        if (tipo == null || tipo.isBlank() || descripcion == null) {
            log.warn("[AUDITORIA] Evento ignorado: tipo o descripción nulos o vacíos");
            return;
        }

        try {
            Map<String, Object> payload = construirPayload(tipo, descripcion);
            restTemplate.postForEntity(lambdaUrl, payload, String.class);
            log.info("[AUDITORIA] Evento {} enviado exitosamente a Lambda", tipo);
        } catch (Exception e) {
            log.error("[AUDITORIA] Error al notificar evento {}: {}", tipo, e.getMessage(), e);
        }
    }

    private Map<String, Object> construirPayload(String tipo, String descripcion) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("tipo", tipo);
        payload.put("descripcion", descripcion);
        payload.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        payload.put("source", appName);
        return payload;
    }
}