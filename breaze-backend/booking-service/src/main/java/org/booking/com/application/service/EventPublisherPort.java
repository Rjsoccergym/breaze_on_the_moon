package org.booking.com.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.booking.com.application.port.IEventPublisherPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventPublisherPort implements IEventPublisherPort {

    private final RestTemplate restTemplate;

    @Value("${app.auditoria-url}")
    private String auditoriaUrl;

    @Async
    @Override
    public void notificarEvento(String tipo, String descripcion) {
        if (tipo == null || tipo.isBlank() || descripcion == null) {
            log.warn("[AUDITORIA] Evento ignorado: tipo o descripción nulos o vacíos");
            return;
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("tipo", tipo);
            payload.put("descripcion", descripcion);
            restTemplate.postForEntity(auditoriaUrl, payload, String.class);
            log.info("[AUDITORIA] Evento {} enviado exitosamente", tipo);
        } catch (Exception e) {
            log.error("[AUDITORIA] Error al notificar evento {}: {}", tipo, e.getMessage(), e);
        }
    }
}