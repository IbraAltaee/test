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
public class Drone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Getter
    @Setter
    private String name;

    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    private UAV uav;

    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    private LateralContingencyVolume lateralContingencyVolume;

    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    private VerticalContingencyVolume verticalContingencyVolume;

    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    private GroundRiskBuffer groundRiskBuffer;

    @Getter
    @Setter
    private double maxFlightAltitude;

    public Drone(String name, UAV uav, LateralContingencyVolume lateralContingencyVolume,
                 VerticalContingencyVolume verticalContingencyVolume, GroundRiskBuffer groundRiskBuffer,
                 double maxFlightAltitude) {
        this.name = name;
        this.uav = uav;
        this.lateralContingencyVolume = lateralContingencyVolume;
        this.verticalContingencyVolume = verticalContingencyVolume;
        this.groundRiskBuffer = groundRiskBuffer;
        this.maxFlightAltitude = maxFlightAltitude;
    }
}