package droneportTeam05.domain.risk;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;


import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class GroundRiskBuffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private TerminationType termination;

    @Setter
    private double timeToOpenParachute;
    private double maxPermissibleWindSpeed;
    private double rateOfDescent;

    private double glideRatio;

    @Setter
    private double minLateralDimension;

    public GroundRiskBuffer(TerminationType termination) {
        this.termination = termination;
    }

    public GroundRiskBuffer() {

    }

    // Static factory methods for different termination types
    public static GroundRiskBuffer forParachute(double timeToOpenParachute, double maxPermissibleWindSpeed, double rateOfDescent) {
        GroundRiskBuffer grb = new GroundRiskBuffer(TerminationType.PARACHUTE);
        grb.timeToOpenParachute = timeToOpenParachute;
        if (timeToOpenParachute < 3) {
            throw new IllegalArgumentException("Time to open parachute must be non-negative");
        }
        grb.maxPermissibleWindSpeed = maxPermissibleWindSpeed;
        grb.rateOfDescent = rateOfDescent;
        return grb;
    }
    
    public static GroundRiskBuffer forGliding(double glideRatio) {
        GroundRiskBuffer grb = new GroundRiskBuffer(TerminationType.OFF_GLIDING);
        grb.glideRatio = glideRatio;
        return grb;
    }
    
    public static GroundRiskBuffer forBallistic() {
        return new GroundRiskBuffer(TerminationType.BALLISTIC_APPROACH);
    }
    
    public static GroundRiskBuffer forSimplified() {
        return new GroundRiskBuffer(TerminationType.SIMPLIFIED_APPROACH);
    }
    
    public static GroundRiskBuffer forPowerOffNoGlide() {
        return new GroundRiskBuffer(TerminationType.OFF_NO_GLIDING);
    }
}
