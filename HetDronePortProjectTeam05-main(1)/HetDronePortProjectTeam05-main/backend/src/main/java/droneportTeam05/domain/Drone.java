package droneportTeam05.domain;

import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "drones")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Drone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @OneToOne(cascade = CascadeType.ALL)
    private UAV uav;

    @OneToOne(cascade = CascadeType.ALL)
    private LateralContingencyVolume lateralContingencyVolume;

    @OneToOne(cascade = CascadeType.ALL)
    private VerticalContingencyVolume verticalContingencyVolume;

    @OneToOne(cascade = CascadeType.ALL)
    private GroundRiskBuffer groundRiskBuffer;

    public Drone(String name, UAV uav, LateralContingencyVolume lateralContingencyVolume,
                 VerticalContingencyVolume verticalContingencyVolume, GroundRiskBuffer groundRiskBuffer) {
        this.name = name;
        this.uav = uav;
        this.lateralContingencyVolume = lateralContingencyVolume;
        this.verticalContingencyVolume = verticalContingencyVolume;
        this.groundRiskBuffer = groundRiskBuffer;
    }
}