package droneportTeam05.controllers;

import droneportTeam05.service.AppSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class AppSettingController {

    private final AppSettingService service;

    public AppSettingController(AppSettingService service) {
        this.service = service;
    }

    @GetMapping("/notifications-enabled")
    public ResponseEntity<Boolean> getNotificationsEnabled() {
        return ResponseEntity.ok(service.isNotificationsEnabled());
    }

    @PutMapping("/toggle-notifications")
    public ResponseEntity<Void> updateNotificationsEnabled(@RequestBody Boolean enabled) {
        service.setNotificationsEnabled(enabled);
        return ResponseEntity.ok().build();
    }

}
