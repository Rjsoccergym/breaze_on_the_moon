package client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.UUID;
import java.util.Map;

@FeignClient(name = "room-service")
public interface IHabitacionCliente {
    @GetMapping("/api/v1/rooms/{id}/disponibilidad")
    boolean verificarDisponibilidad(@PathVariable("id") UUID id);

    @PatchMapping("/api/v1/rooms/{id}/estado")
    void actualizarEstadoHabitacion(@PathVariable("id") UUID id, @RequestBody Map<String, String> estado);
}