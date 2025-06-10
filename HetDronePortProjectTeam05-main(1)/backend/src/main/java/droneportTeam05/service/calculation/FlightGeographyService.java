package droneportTeam05.service.calculation;

import org.springframework.stereotype.Service;

import droneportTeam05.domain.geography.FlightGeography;

@Service
public class FlightGeographyService {

    public FlightGeography calculateMinFlightDimensions(double flightHeight, double maxCharacteristicDimension) {
        double minHeight = maxCharacteristicDimension *3;
        double minWidth = maxCharacteristicDimension *3;
        return new FlightGeography(flightHeight, minHeight, minWidth);
    }
    
}
