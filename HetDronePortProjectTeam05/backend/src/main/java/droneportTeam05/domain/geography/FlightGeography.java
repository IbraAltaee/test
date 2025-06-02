package droneportTeam05.domain.geography;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FlightGeography {
    @Setter
    private double heightFlightGeo;
    private double minHeight;
    private double minWdith;
}


