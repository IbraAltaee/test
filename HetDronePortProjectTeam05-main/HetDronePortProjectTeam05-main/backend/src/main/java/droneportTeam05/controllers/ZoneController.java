package droneportTeam05.controllers;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import droneportTeam05.domain.zones.Zone;
import droneportTeam05.service.ZoneService;
import droneportTeam05.util.ServiceException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping
    public List<Zone> getAllZones() {
        return zoneService.getAllZones();
    }

    @GetMapping("/{maxHeight}")
    public List<Zone> getZonesGreaterThanMaxHeight(@PathVariable double maxHeight) {
        List<Zone> zones = zoneService.getZonesGreaterThanMaxHeight(maxHeight);
        return zones;
    }

    @PostMapping("/admin")
    public Zone createZone(@Valid @RequestBody Zone zone) {
        return zoneService.createZone(zone);
    }

    @PutMapping("/admin/{name}")
    public Zone updateZone(
            @PathVariable String name,
            @Valid @RequestBody Zone zone) throws ServiceException {
        return zoneService.updateZone(name, zone);
    }

    @DeleteMapping("/admin/{name}")
    public String deleteZone(@PathVariable String name) throws ServiceException {
        return zoneService.deleteZone(name);
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler({ ServiceException.class})
    public Map<String, String> handleValidationExceptions(Exception ex) {
        Map<String, String> errors = new HashMap<>();
        if (ex instanceof ServiceException) {
            ServiceException serviceException = (ServiceException) ex;
            errors.put(serviceException.getField(), serviceException.getMessage());
        } else {
            errors.put("error", ex.getMessage());
        }
        return errors;
    }
}