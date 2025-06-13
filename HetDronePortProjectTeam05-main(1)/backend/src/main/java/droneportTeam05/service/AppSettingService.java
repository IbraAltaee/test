package droneportTeam05.service;

import droneportTeam05.domain.AppSetting;
import droneportTeam05.repository.AppSettingRepository;
import org.springframework.stereotype.Service;

@Service
public class AppSettingService {

    private final AppSettingRepository repository;

    public AppSettingService(AppSettingRepository repository) {
        this.repository = repository;
    }

    public boolean isNotificationsEnabled() {
        return repository.findById("notifications_enabled")
                .map(AppSetting::getValue)
                .orElse(false);
    }

    public void setNotificationsEnabled(boolean enabled) {
        repository.save(new AppSetting("notifications_enabled", enabled));
    }
}