package droneportTeam05.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "app_settings")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AppSetting {
    @Id
    private String key;
    private Boolean value;
}
