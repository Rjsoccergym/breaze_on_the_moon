package org.booking.com.application.client;

import org.booking.com.application.dto.HabitacionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;
import java.util.UUID;

@FeignClient(name = "room-service", url = "${services.room-service.url}")
public interface IHabitacionCliente {

    @GetMapping("/api/v1/room/{id}")
    HabitacionDTO obtenerHabitacion(@PathVariable("id") UUID id);

    @GetMapping("/api/v1/room/{id}/availability")
    Map<String, Boolean> verificarDisponibilidad(@PathVariable("id") UUID id);

    @PatchMapping("/api/v1/room/{id}/status")
    void actualizarEstadoHabitacion(@PathVariable("id") UUID id, @RequestBody Map<String, String> estado);
}