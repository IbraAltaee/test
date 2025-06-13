package droneportTeam05.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import droneportTeam05.domain.AppSetting;


public interface AppSettingRepository extends JpaRepository<AppSetting, String> {
}
