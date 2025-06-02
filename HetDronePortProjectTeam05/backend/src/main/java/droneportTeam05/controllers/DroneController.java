package droneportTeam05.controllers;

import droneportTeam05.domain.Drone;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import droneportTeam05.service.DroneService;
import droneportTeam05.util.ServiceException;

import java.util.List;

@RestController
@RequestMapping("/api/drones")
public class DroneController {
    private final DroneService droneService;

    public DroneController(DroneService droneService) {
        this.droneService = droneService;
    }

    @GetMapping
    public List<Drone> getAllDrones() {
        return droneService.getAllDrones();
    }

    @PostMapping("/admin")
    public Drone createDrone(@Valid @RequestBody Drone drone) {
        return droneService.createDrone(drone);
    }

    @PutMapping("/admin/{name}")
    public Drone updateDrone(
            @PathVariable String name,
            @Valid @RequestBody Drone drone) throws ServiceException {
        return droneService.updateDrone(name, drone);
    }

    @DeleteMapping("/admin/{name}")
    public String deleteDrone(@PathVariable String name) throws ServiceException {
        return droneService.deleteDrone(name);
    }
}
