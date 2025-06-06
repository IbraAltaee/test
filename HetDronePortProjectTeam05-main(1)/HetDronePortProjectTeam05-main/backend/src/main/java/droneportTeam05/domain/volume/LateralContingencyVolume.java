package droneportTeam05.domain.volume;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class LateralContingencyVolume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private ContingencyManoeuvre contingencyManoeuvre;
    private int rollAngle = 30;
    private double timeToOpenParachute;
    private int pitchAngle = 45;

    @Setter
    private double lateralExtension;

    public LateralContingencyVolume(ContingencyManoeuvre contingencyManoeuvre) {
        this.contingencyManoeuvre = contingencyManoeuvre;
    }

    public static LateralContingencyVolume forStopping(int pitchAngle) {
        LateralContingencyVolume lcv = new LateralContingencyVolume(ContingencyManoeuvre.STOPPING);
        lcv.pitchAngle = pitchAngle;
        return lcv;
    }
    
    public static LateralContingencyVolume forTurn180(int rollAngle) {
        LateralContingencyVolume lcv = new LateralContingencyVolume(ContingencyManoeuvre.TURN_180);
        lcv.rollAngle = rollAngle;
        return lcv;
    }
    
    public static LateralContingencyVolume forParachute(double timeToOpenParachute) {
        LateralContingencyVolume lcv = new LateralContingencyVolume(ContingencyManoeuvre.PARACHUTE_TERMINATION);
        lcv.timeToOpenParachute = timeToOpenParachute;
        return lcv;
    }

}
