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
public class VerticalContingencyVolume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Setter
    private double responseHeight;
    private ContingencyManoeuvre contingencyManoeuvre;

    @Setter
    private double timeToOpenParachute;
    
    @Setter
    private double heightContingencyManoeuvre;

    @Setter
    private double minVerticalDimension;

    public VerticalContingencyVolume(ContingencyManoeuvre contingencyManoeuvre) {
        this.contingencyManoeuvre = contingencyManoeuvre;
    }

    public static VerticalContingencyVolume forParachute(int timeToOpenParachute) {
        VerticalContingencyVolume vcv = new VerticalContingencyVolume(ContingencyManoeuvre.PARACHUTE_TERMINATION);
        vcv.timeToOpenParachute = timeToOpenParachute;
        return vcv;
    }
    
    public static VerticalContingencyVolume forEnergyConversion() {
        return new VerticalContingencyVolume(ContingencyManoeuvre.ENERGY_CONVERSION);
    }
    
    public static VerticalContingencyVolume forCircularPath() {
        return new VerticalContingencyVolume(ContingencyManoeuvre.CIRCULAR_PATH);
    }
}
